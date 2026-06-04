module.exports = async (req, res) => {
  // Only allow POST requests from your frontend
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  try {
    const { messages, systemPrompt } = req.body;
    const geminiMessages = [];

    // Format the messages correctly for the Gemini API
    geminiMessages.push({ role: "user", parts: [{ text: systemPrompt }] });
    geminiMessages.push({ role: "model", parts: [{ text: "Understood. I am Ra." }] });

    messages.forEach(msg => {
      geminiMessages.push({ 
        role: msg.role === 'assistant' ? 'model' : 'user', 
        parts: [{ text: msg.content }] 
      });
    });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1000,
          response_mime_type: "application/json"
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      res.status(500).json({ error: data.error.message });
      return;
    }

    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};