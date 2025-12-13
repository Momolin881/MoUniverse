import { Innertube } from 'youtubei.js';

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

    // Initialize YouTube client
    const youtube = await Innertube.create();

    // Get video info
    const info = await youtube.getInfo(finalVideoId);

    // Get transcript
    const transcriptData = await info.getTranscript();

    if (!transcriptData || !transcriptData.transcript) {
      return res.status(404).json({
        success: false,
        error: '此影片沒有可用的字幕'
      });
    }

    // Format transcript
    const transcript = transcriptData.transcript;
    const formattedTranscript = transcript.content.body.initial_segments.map(segment => ({
      time: Math.round(segment.start_ms / 1000), // Convert to seconds
      text: segment.snippet.text,
      duration: Math.round(segment.end_ms / 1000) - Math.round(segment.start_ms / 1000)
    }));

    // Get full text
    const fullText = formattedTranscript.map(item => item.text).join(' ');

    return res.status(200).json({
      success: true,
      videoId: finalVideoId,
      transcript: formattedTranscript,
      fullText: fullText,
      totalItems: formattedTranscript.length
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);

    return res.status(500).json({
      success: false,
      error: '無法取得字幕',
      message: error.message,
      details: '可能原因：1) 影片沒有字幕 2) 影片 ID 錯誤 3) 影片不公開'
    });
  }
}
