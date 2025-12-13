import { YoutubeTranscript } from 'youtube-transcript';

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

    // Fetch transcript using youtube-transcript library
    const transcript = await YoutubeTranscript.fetchTranscript(finalVideoId);

    if (!transcript || transcript.length === 0) {
      return res.status(404).json({
        success: false,
        error: '此影片沒有可用的字幕'
      });
    }

    // Format transcript to match our expected format
    const formattedTranscript = transcript.map(item => ({
      time: Math.round(item.offset / 1000), // Convert from ms to seconds
      text: item.text,
      duration: Math.round(item.duration / 1000) // Convert from ms to seconds
    }));

    // Get full text
    const fullText = formattedTranscript.map(item => item.text).join(' ');

    console.log(`Successfully fetched ${formattedTranscript.length} transcript items`);

    return res.status(200).json({
      success: true,
      videoId: finalVideoId,
      transcript: formattedTranscript,
      fullText: fullText,
      totalItems: formattedTranscript.length
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);

    // Handle specific error cases
    let errorMessage = '無法取得字幕';
    let statusCode = 500;

    if (error.message && error.message.includes('Could not find captions')) {
      errorMessage = '此影片沒有可用的字幕';
      statusCode = 404;
    } else if (error.message && error.message.includes('Video unavailable')) {
      errorMessage = '影片不存在或無法訪問';
      statusCode = 404;
    } else if (error.message && error.message.includes('private')) {
      errorMessage = '影片為私人影片';
      statusCode = 404;
    }

    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      message: error.message
    });
  }
}
