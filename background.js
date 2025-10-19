// Background script for Tab to Popup Window extension

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
    convertTabToPopup(tab);
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "convert-to-popup") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        convertTabToPopup(tabs[0]);
      }
    });
  }
});

// Handle popup button clicks
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convertToPopup") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        convertTabToPopup(tabs[0]);
      }
    });
    sendResponse({ success: true });
  }
});

// Main function to convert tab to popup window
function convertTabToPopup(tab) {
  if (!tab || !tab.url) {
    console.error("Invalid tab or URL");
    return;
  }

  // Create popup window
  chrome.windows.create({
    url: tab.url,
    type: "popup",
    width: 800,
    height: 600,
    focused: true
  }, (popupWindow) => {
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
  });
}
