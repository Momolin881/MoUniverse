// Global state
let currentHue = 210;
let currentSaturation = 50;
let currentLightness = 50;
let currentFormat = 'hex';
let recentColors = [];

// DOM elements
const colorCanvas = document.getElementById('colorCanvas');
const colorSelector = document.getElementById('colorSelector');
const hueSlider = document.getElementById('hueSlider');
const hexBtn = document.getElementById('hexBtn');
const rgbBtn = document.getElementById('rgbBtn');
const colorCodeInput = document.getElementById('colorCode');
const copyBtn = document.getElementById('copyBtn');
const pickBtn = document.getElementById('pickBtn');
const recentColorsContainer = document.getElementById('recentColors');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadRecentColors();
  drawColorCanvas();
  updateColorDisplay();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Hue slider
  hueSlider.addEventListener('input', (e) => {
    currentHue = parseInt(e.target.value);
    drawColorCanvas();
    updateColorDisplay();
  });

  // Canvas interaction
  colorCanvas.addEventListener('mousedown', startColorSelection);
  colorCanvas.addEventListener('mousemove', handleColorSelection);
  colorCanvas.addEventListener('mouseup', stopColorSelection);
  colorCanvas.addEventListener('mouseleave', stopColorSelection);

  // Format buttons
  hexBtn.addEventListener('click', () => switchFormat('hex'));
  rgbBtn.addEventListener('click', () => switchFormat('rgb'));

  // Copy button
  copyBtn.addEventListener('click', copyColorCode);

  // Pick button
  pickBtn.addEventListener('click', activateColorPicker);

  // Click color code to select all
  colorCodeInput.addEventListener('click', () => colorCodeInput.select());
}

// Draw color gradient on canvas
function drawColorCanvas() {
  const ctx = colorCanvas.getContext('2d');
  const width = colorCanvas.width;
  const height = colorCanvas.height;

  // Create base color from hue
  const baseColor = `hsl(${currentHue}, 100%, 50%)`;

  // White to color gradient (horizontal)
  const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
  whiteGradient.addColorStop(0, 'white');
  whiteGradient.addColorStop(1, baseColor);
  ctx.fillStyle = whiteGradient;
  ctx.fillRect(0, 0, width, height);

  // Transparent to black gradient (vertical)
  const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
  blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
  ctx.fillStyle = blackGradient;
  ctx.fillRect(0, 0, width, height);
}

// Color selection handlers
let isSelecting = false;

function startColorSelection(e) {
  isSelecting = true;
  colorSelector.classList.add('active');
  selectColorAt(e);
}

function handleColorSelection(e) {
  if (isSelecting) {
    selectColorAt(e);
  }
}

function stopColorSelection() {
  isSelecting = false;
}

function selectColorAt(e) {
  const rect = colorCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Update selector position
  colorSelector.style.left = `${x}px`;
  colorSelector.style.top = `${y}px`;

  // Get color from canvas
  const ctx = colorCanvas.getContext('2d');
  const imageData = ctx.getImageData(x * 2, y * 2, 1, 1).data;
  const rgb = { r: imageData[0], g: imageData[1], b: imageData[2] };

  // Update current color
  updateCurrentColorFromRGB(rgb);
  updateColorDisplay();
}

// Color conversion functions
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function updateCurrentColorFromRGB(rgb) {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  currentSaturation = hsl.s;
  currentLightness = hsl.l;
}

function getCurrentRGB() {
  return hslToRgb(currentHue, currentSaturation, currentLightness);
}

// Update color display
function updateColorDisplay() {
  const rgb = getCurrentRGB();
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  if (currentFormat === 'hex') {
    colorCodeInput.value = hex;
  } else {
    colorCodeInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  // Update selector color
  colorSelector.style.background = hex;
}

// Switch format
function switchFormat(format) {
  currentFormat = format;

  if (format === 'hex') {
    hexBtn.classList.add('active');
    rgbBtn.classList.remove('active');
  } else {
    rgbBtn.classList.add('active');
    hexBtn.classList.remove('active');
  }

  updateColorDisplay();
}

// Copy color code
async function copyColorCode() {
  try {
    await navigator.clipboard.writeText(colorCodeInput.value);

    // Visual feedback
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.classList.remove('copied');
    }, 1000);

    // Add to recent colors
    const rgb = getCurrentRGB();
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    addToRecentColors(hex);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

// Activate color picker from webpage
async function activateColorPicker() {
  try {
    // First, try to use the modern EyeDropper API if available
    if ('EyeDropper' in window) {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      // Parse the color
      const rgb = hexToRgb(result.sRGBHex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      currentHue = hsl.h;
      currentSaturation = hsl.s;
      currentLightness = hsl.l;

      hueSlider.value = currentHue;
      drawColorCanvas();
      updateColorDisplay();

      addToRecentColors(result.sRGBHex);
      return;
    }

    // Fallback to content script method
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Inject content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    // Wait a bit for script to load
    await new Promise(resolve => setTimeout(resolve, 100));

    // Send message to activate picker
    await chrome.tabs.sendMessage(tab.id, { action: 'activatePicker' });

    // Wait a bit before closing to ensure message is sent
    await new Promise(resolve => setTimeout(resolve, 100));

    // Close popup
    window.close();
  } catch (err) {
    console.error('Failed to activate picker:', err);
    alert('無法啟動取色器。請確保您不是在 chrome:// 或擴充功能頁面上。');
  }
}

// Recent colors management
function loadRecentColors() {
  chrome.storage.local.get(['recentColors'], (result) => {
    recentColors = result.recentColors || [];
    displayRecentColors();
  });
}

function addToRecentColors(hex) {
  // Remove if already exists
  recentColors = recentColors.filter(c => c !== hex);

  // Add to beginning
  recentColors.unshift(hex);

  // Keep only last 6 colors
  recentColors = recentColors.slice(0, 6);

  // Save to storage
  chrome.storage.local.set({ recentColors });

  displayRecentColors();
}

function displayRecentColors() {
  recentColorsContainer.innerHTML = '';

  recentColors.forEach(hex => {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'recent-color';
    colorDiv.style.backgroundColor = hex;
    colorDiv.dataset.color = hex;
    colorDiv.title = hex;

    colorDiv.addEventListener('click', () => {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      currentHue = hsl.h;
      currentSaturation = hsl.s;
      currentLightness = hsl.l;

      hueSlider.value = currentHue;
      drawColorCanvas();
      updateColorDisplay();
    });

    recentColorsContainer.appendChild(colorDiv);
  });
}

// Listen for color picked from webpage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'colorPicked') {
    const { r, g, b } = message.color;
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);

    currentHue = hsl.h;
    currentSaturation = hsl.s;
    currentLightness = hsl.l;

    hueSlider.value = currentHue;
    drawColorCanvas();
    updateColorDisplay();

    addToRecentColors(hex);
  }
});
