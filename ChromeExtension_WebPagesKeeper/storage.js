// Chrome Storage API 封裝
const StorageManager = {
  // 取得所有分類
  async getCategories() {
    const result = await chrome.storage.local.get(['categories']);
    return result.categories || [];
  },

  // 儲存分類
  async saveCategories(categories) {
    await chrome.storage.local.set({ categories });
  },

  // 新增分類
  async addCategory(categoryName) {
    const categories = await this.getCategories();
    const newCategory = {
      id: Date.now().toString(),
      name: categoryName,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };
    categories.push(newCategory);
    await this.saveCategories(categories);
    return newCategory;
  },

  // 更新分類使用次數
  async incrementCategoryUsage(categoryName) {
    const categories = await this.getCategories();
    const category = categories.find(c => c.name === categoryName);
    if (category) {
      category.usageCount++;
      await this.saveCategories(categories);
    }
  },

  // 取得所有標籤
  async getTags() {
    const result = await chrome.storage.local.get(['tags']);
    return result.tags || [];
  },

  // 儲存標籤
  async saveTags(tags) {
    await chrome.storage.local.set({ tags });
  },

  // 新增標籤
  async addTag(tagName) {
    const tags = await this.getTags();
    const existingTag = tags.find(t => t.name === tagName);

    if (existingTag) {
      return existingTag;
    }

    const newTag = {
      id: Date.now().toString(),
      name: tagName,
      color: this.getRandomColor(),
      usageCount: 0
    };
    tags.push(newTag);
    await this.saveTags(tags);
    return newTag;
  },

  // 更新標籤使用次數
  async incrementTagUsage(tagNames) {
    const tags = await this.getTags();
    tagNames.forEach(tagName => {
      const tag = tags.find(t => t.name === tagName);
      if (tag) {
        tag.usageCount++;
      }
    });
    await this.saveTags(tags);
  },

  // 取得常用標籤（依使用次數排序）
  async getPopularTags(limit = 5) {
    const tags = await this.getTags();
    return tags
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  },

  // 儲存網頁記錄（選配）
  async savePageRecord(record) {
    const result = await chrome.storage.local.get(['savedPages']);
    const savedPages = result.savedPages || [];
    savedPages.unshift(record);

    // 只保留最近 100 筆
    if (savedPages.length > 100) {
      savedPages.pop();
    }

    await chrome.storage.local.set({ savedPages });
  },

  // 隨機顏色生成
  getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
};

// 暴露給全域使用
window.StorageManager = StorageManager;
