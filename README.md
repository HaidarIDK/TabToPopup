# Tab To Popup Window Chrome Extension

A Chrome extension that allows users to quickly convert the current tab into a standalone popup window.

## Features

- Convert the current tab into a standalone popup window
- Easily manage multiple browser windows
- Support standard tab operations within the popup window (e.g., close, refresh, etc.)
- Right-click context menu support
- Keyboard shortcut support (Ctrl+Shift+Y / Cmd+Shift+Y)
- Clean and modern UI

## Installation

### Load Extension in Chrome
1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked"
5. Select the folder containing your extension files
6. The extension should now appear in your extensions list

## Usage

### Method 1: Extension Icon
Click the extension icon in the Chrome toolbar and then click "Convert to Popup Window"

### Method 2: Right-click Context Menu
Right-click on any tab or page and select "Convert to popup window"

### Method 3: Keyboard Shortcut
- Windows/Linux: `Ctrl + Shift + Y`
- Mac: `Cmd + Shift + Y`

## File Structure

```
TabToPopup/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── popup.html            # Extension popup UI
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icon.png              # Extension icon (48x48)
├── icon_generator.html   # Tool to generate icons
└── README.md             # This file
```

## Troubleshooting

- If the extension doesn't load, check the console for errors in `chrome://extensions/`
- Ensure all required files are present in the extension folder

## Development

This extension is built with:
- Manifest V3 (latest Chrome extension standard)
- Vanilla JavaScript (no external dependencies)
- Modern CSS with gradients and animations

## Permissions

The extension requires minimal permissions:
- `tabs`: To access and manipulate browser tabs
- `contextMenus`: To add right-click menu options
- `activeTab`: To interact with the current active tab

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
