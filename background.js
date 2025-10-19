// Background script for Tab to Popup Window extension

// Track popup windows
let popupWindows = new Set();

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertToPopup",
    title: "Convert to popup window",
    contexts: ["page", "tab"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertToPopup") {
    // Get user preference for context menu
    chrome.storage.sync.get(['keepOnTop'], function(result) {
      convertTabToPopup(tab, result.keepOnTop !== false); // Default to true
    });
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "convert-to-popup") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        // Get user preference for keyboard shortcut
        chrome.storage.sync.get(['keepOnTop'], function(result) {
          convertTabToPopup(tabs[0], result.keepOnTop !== false); // Default to true
        });
      }
    });
  }
});

// Handle popup button clicks
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === "convertToPopup") {
    console.log('Converting tab to popup with keepOnTop:', request.keepOnTop);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('Active tabs:', tabs);
      if (tabs[0]) {
        convertTabToPopup(tabs[0], request.keepOnTop);
        sendResponse({ success: true });
      } else {
        console.error('No active tab found');
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // Keep the message channel open for async response
  } else if (request.action === "bringToFront") {
    console.log('Bringing popup to front');
    const popupArray = Array.from(popupWindows);
    if (popupArray.length > 0) {
      const latestPopupId = popupArray[popupArray.length - 1];
      chrome.windows.update(latestPopupId, { focused: true }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error bringing popup to front:', chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          console.log('Successfully brought popup to front');
          sendResponse({ success: true });
        }
      });
    } else {
      console.log('No popup windows to bring to front');
      sendResponse({ success: false, error: 'No popup windows found' });
    }
    return true;
  } else if (request.action === "checkPopupWindows") {
    console.log('Checking for popup windows:', popupWindows.size > 0);
    sendResponse({ hasPopupWindows: popupWindows.size > 0 });
    return true;
  }
});

// AGGRESSIVE focus management - keep popup on top FOREVER
let focusIntervals = new Map(); // Track intervals for each popup window

// Additional aggressive strategies
let lastFocusCheck = Date.now();

// MAXIMUM AGGRESSION: Continuous focus check every 100ms
setInterval(() => {
  if (popupWindows.size > 0) {
    const popupArray = Array.from(popupWindows);
    if (popupArray.length > 0) {
      const latestPopupId = popupArray[popupArray.length - 1];
      chrome.windows.get(latestPopupId, (window) => {
        if (window && !window.focused && !isRefocusing) {
          isRefocusing = true;
          chrome.windows.update(latestPopupId, { 
            focused: true,
            state: "normal",
            left: Math.max(0, window.left || 200),
            top: Math.max(0, window.top || 200)
          }, () => {
            setTimeout(() => {
              isRefocusing = false;
            }, 50);
          });
        }
      });
    }
  }
}, 100); // Check every 100ms - MAXIMUM AGGRESSION

// SMARTER focus management - avoid conflicts
let isRefocusing = false;

// Listen for window focus changes to keep popup windows on top
chrome.windows.onFocusChanged.addListener((windowId) => {
  // Only act if we have popup windows and focus changed to a non-popup window
  if (windowId !== chrome.windows.WINDOW_ID_NONE && popupWindows.size > 0 && !isRefocusing) {
    chrome.windows.get(windowId, (window) => {
      if (window && window.type === 'popup' && popupWindows.has(windowId)) {
        // This is one of our popup windows getting focus, that's fine
        return;
      }
      
      // Only refocus if focus went to a regular window (not our popup)
      if (window && window.type === 'normal') {
        isRefocusing = true;
        const popupArray = Array.from(popupWindows);
        if (popupArray.length > 0) {
          const latestPopupId = popupArray[popupArray.length - 1];
          chrome.windows.update(latestPopupId, { focused: true }, () => {
            // Reset flag after a short delay
            setTimeout(() => {
              isRefocusing = false;
            }, 100);
          });
        }
      }
    });
  }
});

// Also listen for tab activation to refocus popup
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (popupWindows.size > 0 && !isRefocusing) {
    isRefocusing = true;
    const popupArray = Array.from(popupWindows);
    if (popupArray.length > 0) {
      const latestPopupId = popupArray[popupArray.length - 1];
      chrome.windows.update(latestPopupId, { focused: true }, () => {
        setTimeout(() => {
          isRefocusing = false;
        }, 100);
      });
    }
  }
});

// Clean up when popup windows are closed
chrome.windows.onRemoved.addListener((windowId) => {
  console.log('Window removed:', windowId);
  popupWindows.delete(windowId);
  
  // Clear all focus intervals for this window
  if (focusIntervals.has(windowId)) {
    clearInterval(focusIntervals.get(windowId));
    focusIntervals.delete(windowId);
  }
  if (focusIntervals.has(windowId + '_recovery')) {
    clearInterval(focusIntervals.get(windowId + '_recovery'));
    focusIntervals.delete(windowId + '_recovery');
  }
});

// Main function to convert tab to popup window
function convertTabToPopup(tab, keepOnTop = true) {
  console.log('convertTabToPopup called with tab:', tab, 'keepOnTop:', keepOnTop);
  
  if (!tab || !tab.url) {
    console.error("Invalid tab or URL");
    return;
  }

  // Try different window types for better "always on top" behavior
  const windowOptions = {
    url: tab.url,
    type: "normal", // Try "normal" instead of "popup" - might have better control
    width: 800,
    height: 600,
    focused: true,
    left: 200,
    top: 200,
    state: "normal",
    // Try to make it behave like a popup but with more control
    incognito: false
  };
  
  console.log('Creating window with options:', windowOptions);
  
  chrome.windows.create(windowOptions, (popupWindow) => {
    if (chrome.runtime.lastError) {
      console.error("Error creating popup window:", chrome.runtime.lastError);
      return;
    }

    // Close the original tab after popup is created
    chrome.tabs.remove(tab.id, () => {
      if (chrome.runtime.lastError) {
        console.error("Error closing original tab:", chrome.runtime.lastError);
      }
    });

    console.log("Successfully converted tab to popup window");
    
    // Track this popup window
    popupWindows.add(popupWindow.id);
    
    // SMART focus management - only refocus when needed
    if (keepOnTop) {
      console.log('Setting up smart focus management for window:', popupWindow.id);
      
      // Strategy 1: Check every 2 seconds if window needs refocusing
      const focusInterval = setInterval(() => {
        chrome.windows.get(popupWindow.id, (window) => {
          if (window && !window.focused && !isRefocusing) {
            isRefocusing = true;
            chrome.windows.update(popupWindow.id, { 
              focused: true,
              state: "normal",
              left: Math.max(0, window.left || 200),
              top: Math.max(0, window.top || 200)
            }, () => {
              setTimeout(() => {
                isRefocusing = false;
              }, 300);
            });
          }
        });
      }, 2000); // Check every 2 seconds
      
      // Strategy 2: Listen for window state changes
      chrome.windows.onStateChanged.addListener((windowId, state) => {
        if (windowId === popupWindow.id && state !== 'minimized' && !isRefocusing) {
          isRefocusing = true;
          chrome.windows.update(popupWindow.id, { 
            focused: true,
            state: "normal"
          }, () => {
            setTimeout(() => {
              isRefocusing = false;
            }, 200);
          });
        }
      });
      
      // Store the interval for cleanup
      focusIntervals.set(popupWindow.id, focusInterval);
    }
  });
}
