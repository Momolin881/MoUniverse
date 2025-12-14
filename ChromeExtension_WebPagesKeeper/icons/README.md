# 圖示說明

## 目前狀態
專案中包含了一個 SVG 格式的圖示 (`icon.svg`)，但 Chrome Extension 需要 PNG 格式的圖示。

## 需要的圖示尺寸
- `icon16.png` - 16x16 像素（工具列小圖示）
- `icon48.png` - 48x48 像素（擴充功能管理頁面）
- `icon128.png` - 128x128 像素（Chrome 線上應用程式商店）

## 如何生成 PNG 圖示

### 方法一：使用線上工具
1. 開啟 `icon.svg`
2. 前往 https://cloudconvert.com/svg-to-png
3. 上傳 SVG 檔案
4. 分別轉換為 16x16、48x48、128x128 三種尺寸
5. 下載並放入 `icons/` 資料夾

### 方法二：使用 Figma/Sketch
1. 匯入 `icon.svg`
2. 匯出為 PNG，選擇對應尺寸
3. 儲存到 `icons/` 資料夾

### 方法三：自己設計
你可以使用任何設計工具（Figma、Sketch、Illustrator）設計自己的圖示：
- 建議使用 Notion 風格的配色（#2EAADC 藍色 + #37352F 深灰）
- 圖示應該簡潔清晰，在小尺寸下也能辨識
- 可以使用書籤、標籤、資料夾等相關圖案

## 臨時解決方案
在正式圖示準備好之前，你可以：
1. 使用任何 PNG 圖片暫時替代
2. 或是在 manifest.json 中暫時註解掉 icons 相關設定
