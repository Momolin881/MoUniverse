export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { videoId, url } = req.query;

  // Extract video ID from URL if provided
  let finalVideoId = videoId;
  if (url && !videoId) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) {
      finalVideoId = match[1];
    }
  }

  if (!finalVideoId) {
    return res.status(400).json({
      success: false,
      error: '請提供 YouTube 影片 ID 或 URL'
    });
  }

  try {
    console.log('Fetching transcript for video ID:', finalVideoId);

    // Step 1: Fetch video page to get caption tracks
    const videoPageUrl = `https://www.youtube.com/watch?v=${finalVideoId}`;
    const videoPageResponse = await fetch(videoPageUrl);
    const videoPageHtml = await videoPageResponse.text();

    // Step 2: Extract caption track URL from page
    const captionTrackRegex = /"captionTracks":(\[.*?\])/;
    const match = videoPageHtml.match(captionTrackRegex);

    if (!match) {
      return res.status(404).json({
        success: false,
        error: '此影片沒有可用的字幕'
      });
    }

    const captionTracks = JSON.parse(match[1]);

    if (!captionTracks || captionTracks.length === 0) {
      return res.status(404).json({
        success: false,
        error: '此影片沒有可用的字幕'
      });
    }

    // Step 3: Find Chinese or English caption track
    let selectedTrack = captionTracks.find(track =>
      track.languageCode === 'zh-Hant' ||
      track.languageCode === 'zh-Hans' ||
      track.languageCode === 'zh'
    );

    if (!selectedTrack) {
      selectedTrack = captionTracks.find(track => track.languageCode === 'en');
    }

    if (!selectedTrack) {
      selectedTrack = captionTracks[0]; // Fallback to first available
    }

    // Step 4: Fetch caption data
    const captionUrl = selectedTrack.baseUrl;
    console.log('Fetching captions from:', captionUrl);
    const captionResponse = await fetch(captionUrl);
    const captionXml = await captionResponse.text();
    console.log('Caption XML length:', captionXml.length);
    console.log('Caption XML preview:', captionXml.substring(0, 500));

    // Step 5: Parse XML to extract captions
    // Try multiple regex patterns for different XML formats
    const textRegex1 = /<text start="([\d.]+)" dur="([\d.]+)"[^>]*>(.*?)<\/text>/gs;
    const textRegex2 = /<text[^>]*start="([\d.]+)"[^>]*dur="([\d.]+)"[^>]*>(.*?)<\/text>/gs;
    const textRegex3 = /<text[^>]*t="(\d+)"[^>]*d="(\d+)"[^>]*>(.*?)<\/text>/gs;

    const formattedTranscript = [];
    let match2;
    let regexToUse = textRegex1;

    // Try first regex pattern
    while ((match2 = regexToUse.exec(captionXml)) !== null) {
      const startTime = parseFloat(match2[1]);
      const duration = parseFloat(match2[2]);
      let text = match2[3];

      // Decode HTML entities
      text = text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
        .trim();

      if (text) {
        formattedTranscript.push({
          time: Math.round(startTime),
          text: text,
          duration: Math.round(duration)
        });
      }
    }

    // If first regex didn't work, try alternative patterns
    if (formattedTranscript.length === 0) {
      console.log('First regex failed, trying alternative patterns...');

      // Try second pattern
      regexToUse = textRegex2;
      while ((match2 = regexToUse.exec(captionXml)) !== null) {
        const startTime = parseFloat(match2[1]);
        const duration = parseFloat(match2[2]);
        let text = match2[3]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/<[^>]*>/g, '')
          .trim();

        if (text) {
          formattedTranscript.push({
            time: Math.round(startTime),
            text: text,
            duration: Math.round(duration)
          });
        }
      }
    }

    // Try third pattern (YouTube's newer format with t= and d=)
    if (formattedTranscript.length === 0) {
      console.log('Second regex failed, trying millisecond format...');
      regexToUse = textRegex3;
      while ((match2 = regexToUse.exec(captionXml)) !== null) {
        const startTime = parseInt(match2[1]) / 1000; // Convert from ms to seconds
        const duration = parseInt(match2[2]) / 1000;
        let text = match2[3]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/<[^>]*>/g, '')
          .trim();

        if (text) {
          formattedTranscript.push({
            time: Math.round(startTime),
            text: text,
            duration: Math.round(duration)
          });
        }
      }
    }

    if (formattedTranscript.length === 0) {
      console.error('All regex patterns failed. XML structure might have changed.');
      return res.status(404).json({
        success: false,
        error: '無法解析字幕內容',
        debug: {
          xmlLength: captionXml.length,
          xmlPreview: captionXml.substring(0, 200)
        }
      });
    }

    // Get full text
    const fullText = formattedTranscript.map(item => item.text).join(' ');

    return res.status(200).json({
      success: true,
      videoId: finalVideoId,
      transcript: formattedTranscript,
      fullText: fullText,
      totalItems: formattedTranscript.length,
      language: selectedTrack.languageCode
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);

    return res.status(500).json({
      success: false,
      error: '無法取得字幕',
      message: error.message,
      details: '可能原因：1) 影片沒有字幕 2) 影片 ID 錯誤 3) 影片不公開 4) YouTube 暫時阻擋請求'
    });
  }
}
