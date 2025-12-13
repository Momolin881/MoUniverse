import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const config = {
  maxDuration: 60, // 最長執行時間 60 秒
};

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { videoId, time } = req.query;

  if (!videoId) {
    return res.status(400).json({
      success: false,
      error: '請提供 YouTube 影片 ID'
    });
  }

  if (time === undefined) {
    return res.status(400).json({
      success: false,
      error: '請提供時間點（秒）'
    });
  }

  let browser = null;

  try {
    console.log(`正在擷取快照：影片 ${videoId}，時間 ${time} 秒`);

    // 啟動瀏覽器
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // 設定視窗大小（16:9 比例）
    await page.setViewport({ width: 1280, height: 720 });

    // 打開 YouTube 影片（帶時間戳）
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(time)}s`;
    console.log('打開 YouTube 頁面:', videoUrl);

    await page.goto(videoUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // 等待影片播放器載入
    await page.waitForSelector('video', { timeout: 10000 });

    // 點擊播放按鈕（如果需要）
    try {
      const playButton = await page.$('.ytp-large-play-button');
      if (playButton) {
        await playButton.click();
        await page.waitForTimeout(2000); // 等待影片開始播放
      }
    } catch (e) {
      console.log('無需點擊播放按鈕');
    }

    // 暫停影片
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.pause();
      }
    });

    // 等待一下確保畫面穩定
    await page.waitForTimeout(1000);

    // 只擷取影片播放器區域
    const videoElement = await page.$('video');
    if (!videoElement) {
      throw new Error('找不到影片元素');
    }

    // 擷取快照
    const screenshot = await videoElement.screenshot({
      type: 'jpeg',
      quality: 85
    });

    // 轉換為 base64
    const base64Image = screenshot.toString('base64');

    console.log('快照擷取成功');

    return res.status(200).json({
      success: true,
      videoId: videoId,
      time: time,
      image: `data:image/jpeg;base64,${base64Image}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('擷取快照失敗:', error);

    return res.status(500).json({
      success: false,
      error: '擷取快照失敗',
      message: error.message,
      details: error.stack
    });

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
