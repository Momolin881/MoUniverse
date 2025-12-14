# 📑 WebPages Keeper - Notion 助手

一個輕量級的 Chrome 擴充套件，幫助你快速將網頁內容分類、標記，並複製到 Notion，輕鬆建立個人知識庫。

## ✨ 主要功能

- 🚀 **快速啟動**：點擊圖示或使用快捷鍵（Mac: `Cmd+Shift+N` / Win: `Alt+Shift+N`）
- 📑 **分類管理**：建立和選擇內容分類，自動記錄使用次數
- 🏷️ **標籤系統**：多選標籤，支援快速新增和常用標籤推薦
- 🔗 **自動抓取**：自動抓取網頁標題、URL、favicon 和時間戳
- 📋 **一鍵複製**：生成 Markdown 格式，直接貼到 Notion

## 🎯 使用流程

1. 瀏覽到有價值的網頁
2. 點擊擴充套件圖示（或按快捷鍵）
3. 選擇分類和標籤
4. （選填）新增個人備註
5. 點擊「複製到剪貼簿」
6. 到 Notion 貼上，完成！

## 📦 安裝方式

### 開發者模式安裝（測試用）

1. 開啟 Chrome 瀏覽器
2. 前往 `chrome://extensions/`
3. 開啟右上角的「開發人員模式」
4. 點擊「載入未封裝項目」
5. 選擇本專案資料夾
6. 完成！

### 注意事項

⚠️ **圖示檔案**：首次安裝需要準備圖示檔案，請參考 `icons/README.md`

## 🛠️ 技術架構

- **框架**：Vue 3 (CDN 版本)
- **儲存**：Chrome Storage API
- **樣式**：Notion 風格設計
- **格式**：Markdown

## 📁 專案結構

```
ChromeExtension_WebPagesKeeper/
├── manifest.json          # Chrome Extension 配置
├── popup.html             # 彈出視窗介面
├── popup.js               # Vue 3 應用程式
├── storage.js             # Storage API 封裝
├── content.js             # 網頁資訊抓取
├── styles.css             # Notion 風格樣式
├── icons/                 # 圖示檔案
│   └── README.md         # 圖示說明
└── README.md              # 專案說明
```

## 🎨 輸出格式範例

複製到剪貼簿的內容格式：

```markdown
📑 **分類**: 技術文章
🏷️ #JavaScript #效能優化 #前端
🔗 [網頁標題](https://example.com)
📅 2024-12-14

📝 **備註**:
這篇文章介紹了 React 效能優化的技巧...
```

## 🔧 開發說明

### 資料結構

**分類 (Category)**
```javascript
{
  "id": "uuid",
  "name": "技術文章",
  "createdAt": "2024-12-14",
  "usageCount": 15
}
```

**標籤 (Tag)**
```javascript
{
  "id": "uuid",
  "name": "JavaScript",
  "color": "#FF6B6B",
  "usageCount": 23
}
```

**儲存記錄 (Saved Page)**
```javascript
{
  "id": "uuid",
  "title": "網頁標題",
  "url": "https://example.com",
  "category": "技術文章",
  "tags": ["JavaScript", "效能優化"],
  "note": "使用者備註",
  "savedAt": "2024-12-14T10:30:00Z"
}
```

### 本地開發

1. 修改任何檔案後，到 `chrome://extensions/` 點擊重新整理
2. 重新開啟 popup 即可看到變更

### 除錯

- **Console**：在 popup 上按右鍵 → 檢查 → Console
- **Storage**：開發者工具 → Application → Storage → Local Storage

## 🚀 未來規劃

### 第二階段功能
- ✅ Notion API 直接整合
- ✅ 資料雙向同步
- ✅ 右鍵選單支援
- ✅ 歷史記錄管理

### 進階功能
- ✅ 批次管理多個分頁
- ✅ AI 智慧分類建議
- ✅ 全文搜尋功能
- ✅ 資料匯出/匯入

## 📝 授權

MIT License

## 🙋 回饋與支援

如有問題或建議，歡迎提出 Issue 或 Pull Request！

---

**打造於 2024** | 使用 Vue 3 + Chrome Extension Manifest V3
