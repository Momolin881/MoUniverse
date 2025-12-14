// Vanilla JavaScript 應用程式

// 全域狀態
const state = {
  pageInfo: {
    title: '',
    url: '',
    favicon: ''
  },
  categories: [],
  selectedCategory: '',
  availableTags: [],
  selectedTags: [],
  popularTags: [],
  note: ''
};

// DOM 元素
const elements = {
  favicon: document.getElementById('favicon'),
  pageTitle: document.getElementById('pageTitle'),
  pageUrl: document.getElementById('pageUrl'),
  categorySelect: document.getElementById('categorySelect'),
  btnShowAddCategory: document.getElementById('btnShowAddCategory'),
  addCategoryBox: document.getElementById('addCategoryBox'),
  newCategoryInput: document.getElementById('newCategoryInput'),
  btnAddCategory: document.getElementById('btnAddCategory'),
  selectedTagsContainer: document.getElementById('selectedTags'),
  btnShowAddTag: document.getElementById('btnShowAddTag'),
  addTagBox: document.getElementById('addTagBox'),
  newTagInput: document.getElementById('newTagInput'),
  btnAddTag: document.getElementById('btnAddTag'),
  popularTagsContainer: document.getElementById('popularTags'),
  existingTagsList: document.getElementById('existing-tags'),
  noteTextarea: document.getElementById('noteTextarea'),
  btnCopy: document.getElementById('btnCopy'),
  successToast: document.getElementById('successToast')
};

// 初始化
async function init() {
  await loadData();
  await getCurrentPageInfo();
  renderCategories();
  renderPopularTags();
  renderExistingTags();
  setupEventListeners();
}

// 載入本地儲存的資料
async function loadData() {
  state.categories = await StorageManager.getCategories();
  state.availableTags = await StorageManager.getTags();
  state.popularTags = await StorageManager.getPopularTags(5);
}

// 取得當前網頁資訊
async function getCurrentPageInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    state.pageInfo = {
      title: tab.title || '',
      url: tab.url || '',
      favicon: tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
    };

    // 更新 UI
    elements.pageTitle.value = state.pageInfo.title;
    elements.pageUrl.textContent = state.pageInfo.url;
    elements.favicon.src = state.pageInfo.favicon;
  } catch (error) {
    console.error('取得網頁資訊失敗:', error);
  }
}

// 渲染分類下拉選單
function renderCategories() {
  // 清空現有選項（保留第一個預設選項）
  elements.categorySelect.innerHTML = '<option value="">選擇分類...</option>';

  // 依使用次數排序並新增選項
  const sortedCategories = [...state.categories].sort((a, b) => b.usageCount - a.usageCount);
  sortedCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.name;
    option.textContent = cat.name;
    elements.categorySelect.appendChild(option);
  });
}

// 渲染已選標籤
function renderSelectedTags() {
  elements.selectedTagsContainer.innerHTML = '';

  state.selectedTags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag-chip';
    span.textContent = `${tag} ×`;
    span.onclick = () => removeTag(tag);
    elements.selectedTagsContainer.appendChild(span);
  });
}

// 渲染常用標籤
function renderPopularTags() {
  elements.popularTagsContainer.innerHTML = '';

  state.popularTags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag-suggestion';
    span.textContent = tag.name;
    span.onclick = () => quickAddTag(tag.name);
    elements.popularTagsContainer.appendChild(span);
  });
}

// 渲染現有標籤到 datalist
function renderExistingTags() {
  elements.existingTagsList.innerHTML = '';

  state.availableTags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag.name;
    elements.existingTagsList.appendChild(option);
  });
}

// 設定事件監聽器
function setupEventListeners() {
  // 分類相關
  elements.categorySelect.addEventListener('change', (e) => {
    state.selectedCategory = e.target.value;
  });

  elements.btnShowAddCategory.addEventListener('click', () => {
    const isVisible = elements.addCategoryBox.style.display !== 'none';
    elements.addCategoryBox.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      elements.newCategoryInput.focus();
    }
  });

  elements.btnAddCategory.addEventListener('click', addCategory);
  elements.newCategoryInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addCategory();
  });

  // 標籤相關
  elements.btnShowAddTag.addEventListener('click', () => {
    const isVisible = elements.addTagBox.style.display !== 'none';
    elements.addTagBox.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      elements.newTagInput.focus();
    }
  });

  elements.btnAddTag.addEventListener('click', addTag);
  elements.newTagInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addTag();
  });

  // 備註
  elements.noteTextarea.addEventListener('input', (e) => {
    state.note = e.target.value;
  });

  // 複製按鈕
  elements.btnCopy.addEventListener('click', copyToClipboard);
}

// 新增分類
async function addCategory() {
  const categoryName = elements.newCategoryInput.value.trim();
  if (!categoryName) return;

  const category = await StorageManager.addCategory(categoryName);
  state.categories.push(category);
  state.selectedCategory = category.name;

  renderCategories();
  elements.categorySelect.value = category.name;
  elements.newCategoryInput.value = '';
  elements.addCategoryBox.style.display = 'none';
}

// 新增標籤
async function addTag() {
  const tagName = elements.newTagInput.value.trim();
  if (!tagName) return;

  if (state.selectedTags.includes(tagName)) {
    elements.newTagInput.value = '';
    return;
  }

  await StorageManager.addTag(tagName);
  state.selectedTags.push(tagName);

  elements.newTagInput.value = '';
  elements.addTagBox.style.display = 'none';

  renderSelectedTags();

  // 重新載入標籤列表
  state.availableTags = await StorageManager.getTags();
  renderExistingTags();
}

// 快速新增標籤
function quickAddTag(tagName) {
  if (!state.selectedTags.includes(tagName)) {
    state.selectedTags.push(tagName);
    renderSelectedTags();
  }
}

// 移除標籤
function removeTag(tagName) {
  state.selectedTags = state.selectedTags.filter(t => t !== tagName);
  renderSelectedTags();
}

// 生成 Markdown 格式
function generateMarkdown() {
  const parts = [];

  // 分類
  if (state.selectedCategory) {
    parts.push(`📑 **分類**: ${state.selectedCategory}`);
  }

  // 標籤
  if (state.selectedTags.length > 0) {
    const tags = state.selectedTags.map(tag => `#${tag}`).join(' ');
    parts.push(`🏷️ ${tags}`);
  }

  // 網頁連結
  const title = elements.pageTitle.value || state.pageInfo.title;
  parts.push(`🔗 [${title}](${state.pageInfo.url})`);

  // 儲存時間
  const now = new Date().toISOString().split('T')[0];
  parts.push(`📅 ${now}`);

  // 備註
  if (state.note.trim()) {
    parts.push(`\n📝 **備註**:\n${state.note.trim()}`);
  }

  return parts.join('\n');
}

// 複製到剪貼簿
async function copyToClipboard() {
  if (!state.pageInfo.title || !state.pageInfo.url) return;

  try {
    const markdown = generateMarkdown();

    // 複製到剪貼簿
    await navigator.clipboard.writeText(markdown);

    // 更新使用次數
    if (state.selectedCategory) {
      await StorageManager.incrementCategoryUsage(state.selectedCategory);
    }
    if (state.selectedTags.length > 0) {
      await StorageManager.incrementTagUsage(state.selectedTags);
    }

    // 儲存記錄
    await StorageManager.savePageRecord({
      id: Date.now().toString(),
      title: elements.pageTitle.value || state.pageInfo.title,
      url: state.pageInfo.url,
      category: state.selectedCategory,
      tags: state.selectedTags,
      note: state.note,
      savedAt: new Date().toISOString()
    });

    // 顯示成功訊息
    showSuccess();

  } catch (error) {
    console.error('複製失敗:', error);
    alert('複製失敗，請重試');
  }
}

// 顯示成功提示
function showSuccess() {
  elements.successToast.style.display = 'block';
  elements.btnCopy.textContent = '✓ 已複製！';

  setTimeout(() => {
    elements.successToast.style.display = 'none';
    elements.btnCopy.textContent = '📋 複製到剪貼簿';
  }, 2000);
}

// 啟動應用程式
document.addEventListener('DOMContentLoaded', init);
