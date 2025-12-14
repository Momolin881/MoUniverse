# Color Picker Chrome Extension

A powerful Chrome extension that allows you to pick colors from any webpage and easily copy HEX or RGB color codes. Perfect for designers, developers, and anyone who needs to identify colors on the web.

## Features

- **Pick Button**: Click to activate color picking mode and select any color from any webpage
- **Color Selector**: Interactive color gradient with hue slider for precise color selection
- **HEX/RGB Toggle**: Switch between HEX and RGB color format display
- **One-Click Copy**: Copy color codes to clipboard with a single click
- **Recent Colors Palette**: Automatically saves your last 6 picked colors for quick access
- **Magnifier Tool**: When picking colors from a webpage, see a magnified view of the area under your cursor
- **Visual Feedback**: Clear visual indicators for successful color copying

## Installation

### Method 1: Load Unpacked Extension (for Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked" button
4. Select the `ChromeExtension-Color Picker` folder
5. The Color Picker extension should now appear in your extensions list

### Method 2: Generate Custom Icons (Optional)

If you want to customize the extension icons:

1. Open `generate-icons.html` in your browser
2. Click each download button to save the icon files
3. Save them in the `icons/` folder as `icon16.png`, `icon48.png`, and `icon128.png`
4. Reload the extension in Chrome

## Usage

### Picking Colors from the Color Gradient

1. Click the extension icon in Chrome toolbar to open the popup
2. Use the color gradient canvas to select your desired color
3. Adjust the hue using the slider below the gradient
4. The selected color code will appear in the display box

### Picking Colors from a Webpage

1. Click the extension icon to open the popup
2. Click the green "Pick" button
3. Move your cursor over the webpage to see the magnified color preview
4. Click on any element to pick its color
5. Press ESC to cancel picking mode

### Copying Color Codes

1. The current color code is displayed in either HEX or RGB format
2. Click the copy button (📋 icon) next to the color code to copy it to clipboard
3. The button will briefly change color to confirm successful copying

### Switching Between HEX and RGB

- Click the "HEX" button to display colors in hexadecimal format (e.g., #AABBCC)
- Click the "RGB" button to display colors in RGB format (e.g., rgb(170, 187, 204))

### Using Recent Colors

- Your last 6 picked colors are automatically saved in the "Recent" section
- Click any recent color to load it back into the color selector
- Hover over a recent color to see its color code

## File Structure

```
ChromeExtension-Color Picker/
├── manifest.json           # Extension configuration
├── popup.html             # Main popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup logic and color management
├── content.js             # Content script for webpage color picking
├── content.css            # Content script styles
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── generate-icons.html    # Tool to generate custom icons
├── create-icons.cjs       # Script to create default icons
└── README.md             # This file
```

## Technical Details

### Permissions

The extension requires the following permissions:
- `activeTab`: To access the current tab for color picking
- `storage`: To save recent colors
- `scripting`: To inject the color picker into webpages

### Color Formats

- **HEX**: 6-digit hexadecimal format (e.g., #FF5733)
- **RGB**: Red, Green, Blue values from 0-255 (e.g., rgb(255, 87, 51))

### Browser Compatibility

- Google Chrome (version 88+)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers

## Tips

1. **Quick Copy**: Click directly on the color code input to select all text for easy copying
2. **Precise Selection**: Use the color gradient for fine-tuned color selection
3. **Website Colors**: Use the Pick button to extract exact colors from websites
4. **Color History**: Recent colors are stored locally and persist between sessions

## Troubleshooting

### Extension not working on some pages

Some pages (like chrome:// URLs or the Chrome Web Store) restrict extension access for security reasons.

### Color picker not activating

1. Make sure you've granted the necessary permissions
2. Try refreshing the webpage before using the picker
3. Check that the extension is enabled in chrome://extensions/

### Recent colors not saving

1. Check that the extension has storage permission
2. Try reinstalling the extension
3. Clear extension data and try again

## Future Enhancements

Potential features for future versions:
- Color palette creation and export
- Color harmony suggestions
- Save custom color palettes
- Export colors to various formats (CSS, SCSS, etc.)
- Color accessibility checker
- Integration with design tools (Figma, Canva, etc.)

## Development

To modify the extension:

1. Make your changes to the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Color Picker extension card
4. Test your changes

## License

This project is open source and available for personal and commercial use.

## Support

If you encounter any issues or have suggestions for improvements, please create an issue or submit a pull request.

---

Made with ❤️ for designers and developers
