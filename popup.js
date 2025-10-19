// Popup script for Tab to Popup Window extension

document.addEventListener('DOMContentLoaded', function() {
    const convertBtn = document.getElementById('convertBtn');
    
    convertBtn.addEventListener('click', function() {
        // Send message to background script to convert tab
        chrome.runtime.sendMessage({ action: "convertToPopup" }, function(response) {
            if (response && response.success) {
                // Close popup after successful conversion
                window.close();
            } else {
                console.error('Failed to convert tab to popup window');
            }
        });
    });
});
