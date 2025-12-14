// Content script for color picking from webpage

// Prevent multiple injections
if (window.colorPickerInjected) {
  console.log('Color Picker already injected');
} else {
  window.colorPickerInjected = true;

  let pickerActive = false;
  let magnifier = null;
  let magnifierCanvas = null;

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message);
    if (message.action === 'activatePicker') {
      activateColorPicker();
      sendResponse({ success: true });
    }
    return true; // Keep message channel open for async response
  });

  console.log('Color Picker content script loaded and listening');
}

function activateColorPicker() {
  if (pickerActive) return;

  pickerActive = true;
  document.body.style.cursor = 'crosshair';

  // Create magnifier
  createMagnifier();

  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('keydown', handleKeyDown, true);

  // Show instruction overlay
  showInstructions();
}

function deactivateColorPicker() {
  pickerActive = false;
  document.body.style.cursor = '';

  // Remove event listeners
  document.removeEventListener('mousemove', handleMouseMove, true);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('keydown', handleKeyDown, true);

  // Remove magnifier
  if (magnifier) {
    magnifier.remove();
    magnifier = null;
    magnifierCanvas = null;
  }

  // Remove instruction overlay
  removeInstructions();
}

function createMagnifier() {
  // Create magnifier container
  magnifier = document.createElement('div');
  magnifier.id = 'color-picker-magnifier';
  magnifier.style.cssText = `
    position: fixed;
    width: 120px;
    height: 120px;
    border: 3px solid #333;
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    display: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    background: white;
  `;

  // Create canvas for magnification
  magnifierCanvas = document.createElement('canvas');
  magnifierCanvas.width = 120;
  magnifierCanvas.height = 120;
  magnifierCanvas.style.cssText = `
    width: 100%;
    height: 100%;
    border-radius: 50%;
  `;

  magnifier.appendChild(magnifierCanvas);
  document.body.appendChild(magnifier);
}

function handleMouseMove(e) {
  if (!pickerActive) return;

  // Position magnifier
  if (magnifier) {
    magnifier.style.display = 'block';
    magnifier.style.left = (e.clientX + 20) + 'px';
    magnifier.style.top = (e.clientY + 20) + 'px';

    // Draw magnified area
    drawMagnifier(e.clientX, e.clientY);
  }
}

function drawMagnifier(x, y) {
  if (!magnifierCanvas) return;

  const ctx = magnifierCanvas.getContext('2d');
  const scale = 8;
  const size = 15;

  // Capture area around cursor
  try {
    // Draw a magnified version of the area
    const color = getColorAtPoint(x, y);

    // Fill with the color
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.fillRect(0, 0, 120, 120);

    // Draw crosshair
    ctx.strokeStyle = color.r + color.g + color.b > 384 ? '#000' : '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 50);
    ctx.lineTo(60, 70);
    ctx.moveTo(50, 60);
    ctx.lineTo(70, 60);
    ctx.stroke();

    // Draw color code
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = color.r + color.g + color.b > 384 ? '#000' : '#fff';
    ctx.textAlign = 'center';
    const hex = rgbToHex(color.r, color.g, color.b);
    ctx.fillText(hex, 60, 100);
  } catch (err) {
    console.error('Error drawing magnifier:', err);
  }
}

function getColorAtPoint(x, y) {
  // Get element at point
  const element = document.elementFromPoint(x, y);

  if (!element) {
    return { r: 255, g: 255, b: 255 };
  }

  // Get computed style
  const style = window.getComputedStyle(element);
  let color = style.backgroundColor;

  // If transparent, check parent elements
  if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
    let parent = element.parentElement;
    while (parent && (color === 'rgba(0, 0, 0, 0)' || color === 'transparent')) {
      color = window.getComputedStyle(parent).backgroundColor;
      parent = parent.parentElement;
    }
  }

  // If still transparent, use white
  if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
    color = 'rgb(255, 255, 255)';
  }

  // Parse RGB
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }

  return { r: 255, g: 255, b: 255 };
}

function handleClick(e) {
  if (!pickerActive) return;

  e.preventDefault();
  e.stopPropagation();

  // Get color at click point
  const color = getColorAtPoint(e.clientX, e.clientY);

  // Send color to popup
  chrome.runtime.sendMessage({
    action: 'colorPicked',
    color: color
  });

  // Deactivate picker
  deactivateColorPicker();
}

function handleKeyDown(e) {
  if (!pickerActive) return;

  // ESC key to cancel
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    deactivateColorPicker();
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function showInstructions() {
  const overlay = document.createElement('div');
  overlay.id = 'color-picker-instructions';
  overlay.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    z-index: 999999;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  overlay.textContent = 'Click to pick a color • Press ESC to cancel';
  document.body.appendChild(overlay);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s';
      setTimeout(() => overlay.remove(), 300);
    }
  }, 3000);
}

function removeInstructions() {
  const overlay = document.getElementById('color-picker-instructions');
  if (overlay) {
    overlay.remove();
  }
}
