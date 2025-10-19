// Popup script for Tab to Popup Window extension

document.addEventListener('DOMContentLoaded', function() {
    const convertBtn = document.getElementById('convertBtn');
    const keepOnTopCheckbox = document.getElementById('keepOnTop');
    const bringToFrontBtn = document.getElementById('bringToFront');
    
    // Load saved preference
    chrome.storage.sync.get(['keepOnTop'], function(result) {
        if (result.keepOnTop !== undefined) {
            keepOnTopCheckbox.checked = result.keepOnTop;
        }
    });
    
    // Check if there are popup windows and show/hide the bring to front button
    chrome.runtime.sendMessage({ action: "checkPopupWindows" }, function(response) {
        if (response && response.hasPopupWindows) {
            bringToFrontBtn.style.display = 'block';
        }
    });
    
    // Save preference when checkbox changes
    keepOnTopCheckbox.addEventListener('change', function() {
        chrome.storage.sync.set({ keepOnTop: this.checked });
    });
    
    // Handle bring to front button
    bringToFrontBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "bringToFront" }, function(response) {
            if (response && response.success) {
                console.log('Brought popup to front');
            } else {
                console.error('Failed to bring popup to front');
            }
        });
    });
    
    convertBtn.addEventListener('click', function() {
        console.log('Convert button clicked');
        console.log('Keep on top setting:', keepOnTopCheckbox.checked);
        
        // Send message to background script to convert tab
        chrome.runtime.sendMessage({ 
            action: "convertToPopup",
            keepOnTop: keepOnTopCheckbox.checked
        }, function(response) {
            console.log('Response from background:', response);
            if (response && response.success) {
                console.log('Successfully converted tab to popup window');
                // Close popup after successful conversion
                window.close();
            } else {
                console.error('Failed to convert tab to popup window');
                console.error('Response:', response);
            }
        });
    });
});
