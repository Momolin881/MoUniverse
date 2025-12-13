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

  // Get API key from environment variable
  const apiKey = process.env.SCREENSHOT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: '未設定 SCREENSHOT_API_KEY 環境變數'
    });
  }

  try {
    console.log(`正在擷取快照：影片 ${videoId}，時間 ${time} 秒`);

    // Construct YouTube URL with timestamp
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(time)}s`;

    // ScreenshotOne API parameters
    const screenshotParams = new URLSearchParams({
      access_key: apiKey,
      url: youtubeUrl,
      viewport_width: '1280',
      viewport_height: '720',
      device_scale_factor: '1',
      format: 'jpeg',
      image_quality: '85',
      block_ads: 'true',
      block_cookie_banners: 'true',
      block_banners_by_heuristics: 'false',
      block_trackers: 'true',
      delay: '3',
      timeout: '30'
    });

    const screenshotApiUrl = `https://api.screenshotone.com/take?${screenshotParams.toString()}`;

    console.log('呼叫 ScreenshotOne API...');

    // Fetch screenshot from ScreenshotOne
    const response = await fetch(screenshotApiUrl);

    if (!response.ok) {
      throw new Error(`ScreenshotOne API 回應錯誤: ${response.status} ${response.statusText}`);
    }

    // Get image as buffer
    const imageBuffer = await response.arrayBuffer();

    // Convert to base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');

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
  }
}
