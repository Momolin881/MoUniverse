# 🚀 快速開始指南

## 📋 安裝前準備（3 分鐘）

### 步驟 1：生成圖示檔案

1. 用瀏覽器開啟 `icons/generate-icons.html`
2. 會自動生成三個尺寸的圖示預覽
3. 點擊「下載全部」按鈕
4. 將下載的 `icon16.png`、`icon48.png`、`icon128.png` 移到 `icons/` 資料夾

### 步驟 2：安裝擴充套件

1. 開啟 Chrome 瀏覽器
2. 在網址列輸入 `chrome://extensions/`
3. 開啟右上角的「開發人員模式」開關
4. 點擊「載入未封裝項目」按鈕
5. 選擇本專案的資料夾 `ChromeExtension_WebPagesKeeper`
6. 完成！✅

## 🎯 第一次使用

### 測試功能

1. **開啟任何網頁**（例如：https://www.notion.so）

2. **啟動擴充套件**
   - 點擊瀏覽器右上角的拼圖圖示
   - 找到「WebPages Keeper」並點擊
   - 或使用快捷鍵：Mac `Cmd+Shift+N` / Windows `Alt+Shift+N`

3. **新增分類**
   - 點擊分類選擇框旁的「+」按鈕
   - 輸入「技術文章」
   - 點擊「新增」

4. **新增標籤**
   - 點擊「+ 新增標籤」按鈕
   - 輸入「Notion」
   - 按 Enter 或點擊「新增」
   - 重複新增更多標籤（如：生產力、工具）

5. **新增備註**（選填）
   - 在備註欄輸入你的想法

6. **複製到剪貼簿**
   - 點擊「📋 複製到剪貼簿」按鈕
   - 看到「✓ 已複製！可至 Notion 貼上」提示

7. **貼到 Notion**
   - 開啟你的 Notion 頁面
   - 按 `Cmd+V` / `Ctrl+V` 貼上
   - 完成！🎉

## 💡 使用技巧

### 快速鍵
- `Cmd+Shift+N` (Mac) / `Alt+Shift+N` (Windows)：開啟擴充套件
- 在輸入框按 `Enter`：快速新增分類/標籤

### 常用標籤
- 擴充套件會記錄你最常用的 5 個標籤
- 這些標籤會顯示在標籤區下方
- 點擊即可快速新增

### 分類排序
- 分類會依照使用次數自動排序
- 最常用的分類會排在前面

### 複製格式
複製到剪貼簿的內容會是這樣的 Markdown 格式：

```markdown
📑 **分類**: 技術文章
🏷️ #Notion #生產力 #工具
🔗 [Notion – The all-in-one workspace](https://www.notion.so)
📅 2024-12-14

📝 **備註**:
這是一個很棒的知識管理工具！
```

## 🔧 常見問題

### Q: 圖示沒有顯示？
**A:** 確認 `icons/` 資料夾中有 `icon16.png`、`icon48.png`、`icon128.png` 三個檔案

### Q: 點擊圖示沒反應？
**A:**
1. 到 `chrome://extensions/` 頁面
2. 找到「WebPages Keeper」
3. 點擊重新整理圖示 🔄
4. 重新嘗試

### Q: 快捷鍵不能用？
**A:**
1. 到 `chrome://extensions/shortcuts`
2. 找到「WebPages Keeper」
3. 設定你想要的快捷鍵

### Q: 儲存的分類/標籤不見了？
**A:** 資料儲存在瀏覽器本地，不會消失。如果遇到問題：
1. 開啟擴充套件的 popup
2. 按右鍵選擇「檢查」
3. 到 Console 看是否有錯誤訊息

### Q: 可以在其他電腦使用嗎？
**A:** 目前分類和標籤儲存在本地，無法同步。未來版本會加入 Notion API 整合，實現跨裝置同步。

## 🎨 自訂圖示

如果你想要自己的圖示設計：

1. 使用 Figma / Sketch / Illustrator 設計
2. 匯出為 PNG 格式
3. 尺寸：16×16、48×48、128×128
4. 儲存到 `icons/` 資料夾並覆蓋原檔案
5. 到 `chrome://extensions/` 重新載入擴充套件

## 📊 查看儲存記錄

想看你儲存了哪些網頁？

1. 開啟擴充套件的 popup
2. 按右鍵選擇「檢查」
3. 到「Application」分頁
4. 左側選單：Storage → Local Storage
5. 選擇你的擴充套件
6. 可以看到 `categories`、`tags`、`savedPages` 等資料

## 🚀 下一步

恭喜你完成了基本設定！現在你可以：

- ✅ 開始整理你的瀏覽記錄
- ✅ 建立個人化的分類系統
- ✅ 用標籤管理知識
- ✅ 將資訊快速同步到 Notion

---

有任何問題或建議？歡迎查看 `README.md` 或提出 Issue！
