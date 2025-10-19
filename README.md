# Tab to Popup Window Chrome Extension

A Chrome extension that converts the current tab into a standalone popup window with aggressive focus management to keep it on top.

## Features

- **Convert Tab to Popup**: Convert any tab into a standalone popup window
- **Aggressive Focus Management**: Multiple strategies to keep the popup window on top
- **User Preferences**: Toggle "keep on top" behavior on/off
- **Multiple Activation Methods**:
  - Extension popup button
  - Right-click context menu
  - Keyboard shortcut (Ctrl+Shift+Y / Cmd+Shift+Y)
- **Manual Control**: "Bring Popup to Front" button for immediate control

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder
5. The extension will be installed and ready to use

## Usage

### Method 1: Extension Popup
1. Click the extension icon in the toolbar
2. Click "Convert to Popup Window"
3. Optionally toggle "Keep popup window on top"

### Method 2: Context Menu
1. Right-click on any tab or page
2. Select "Convert to popup window"

### Method 3: Keyboard Shortcut
- **Windows/Linux**: `Ctrl + Shift + Y`
- **Mac**: `Cmd + Shift + Y`

## Focus Management

The extension uses multiple strategies to keep popup windows on top:

- **Event-based**: Responds to window focus changes and tab activations
- **Interval-based**: Checks every 100ms if window needs refocusing
- **State-based**: Responds to window state changes
- **Conflict prevention**: Prevents multiple operations from interfering

## Technical Details

### Files Structure
- `manifest.json` - Extension configuration
- `background.js` - Service worker with window management logic
- `popup.html` - Extension popup interface
- `popup.css` - Styling for the popup
- `popup.js` - Popup functionality and user preferences
- `icon.png` - Extension icon

### Permissions
- `tabs` - Access to tab information
- `contextMenus` - Right-click context menu
- `activeTab` - Access to current tab
- `storage` - Save user preferences

## Limitations

Due to Chrome's security restrictions, true "always on top" behavior across all applications is not possible with browser extensions. The extension uses the most aggressive focus management possible within Chrome's limitations:

- Focuses popup every 100ms when not focused
- Responds immediately to window/tab changes
- Maintains window state and position
- Prevents conflicts between focus operations

## Development

### Building
No build process required - this is a pure Chrome extension.

### Testing
1. Load the extension in Chrome
2. Test different scenarios:
   - Convert tabs to popup
   - Switch between windows/tabs
   - Test keyboard shortcuts
   - Test context menu

### Debugging
- Open `chrome://extensions/` and click "service worker" for background script logs
- Right-click extension icon and "Inspect popup" for popup logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Feel free to use, modify, and distribute.

## Troubleshooting

### Extension Not Working
1. Reload the extension in `chrome://extensions/`
2. Check console logs for errors
3. Ensure you have a tab open when converting

### Popup Not Staying On Top
- This is a limitation of Chrome extensions
- The extension uses maximum possible aggression within Chrome's restrictions
- For true always-on-top behavior, consider desktop applications

### Permission Errors
- Ensure all required permissions are granted
- Check that the extension is properly loaded

## Future Improvements

- Support for multiple popup windows
- Custom window sizing options
- Better cross-browser compatibility
- Desktop application version for true always-on-top behavior