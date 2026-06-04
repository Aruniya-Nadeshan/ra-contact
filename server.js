require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const server = http.createServer(async (req, res) => {

    // Serve the API endpoint
    if (req.method === 'POST' && req.url === '/api/ra') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { messages, systemPrompt } = JSON.parse(body);
                
                const geminiMessages = [];
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
                    console.error('Gemini API Error:', data.error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: data.error.message }));
                    return;
                }

                const text = data.candidates[0].content.parts[0].text;
                console.log('Ra Transmitting:', text);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ text: text }));

            } catch (error) {
                console.error('Server Error:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
        });
        return;
    }

    let filePath = './public' + req.url;
if (filePath === './public/') filePath = './public/index.html';

    const ext = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.css':  'text/css',
        '.js':   'text/javascript'
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(content);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Ra Contact running at http://localhost:${PORT}`);
});