// Content Script - 網頁資訊抓取
// 這個腳本在每個網頁中運行，用於抓取網頁的額外資訊

// 監聽來自 popup 的訊息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    const pageInfo = {
      title: document.title,
      url: window.location.href,
      description: getMetaDescription(),
      selectedText: getSelectedText()
    };
    sendResponse(pageInfo);
  }
});

// 取得網頁描述
function getMetaDescription() {
  const metaDescription = document.querySelector('meta[name="description"]');
  return metaDescription ? metaDescription.content : '';
}

// 取得使用者選取的文字
function getSelectedText() {
  return window.getSelection().toString().trim();
}

// 可選：自動檢測網頁類型並建議分類
function detectPageType() {
  const url = window.location.href;
  const hostname = window.location.hostname;

  // 根據網域自動建議分類
  const typeMap = {
    'youtube.com': '影片',
    'medium.com': '文章',
    'github.com': '技術',
    'stackoverflow.com': '技術',
    'notion.so': '工具',
    'figma.com': '設計',
    'dribbble.com': '設計'
  };

  for (const [domain, type] of Object.entries(typeMap)) {
    if (hostname.includes(domain)) {
      return type;
    }
  }

  return null;
}
