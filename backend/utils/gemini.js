const axios = require('axios');
require('dotenv').config();

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function optimizeWithGemini(product) {
  const promptText = `
Rewrite the following Amazon product content for SEO and readability:
Title: ${product.title}
Bullets: ${(product.bullets || []).join(', ')}
Description: ${product.description}
Provide JSON with keys: title, bullets, description, keywords
`;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ]
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    });

    const data = response.data;
    console.log('Gemini raw response:', JSON.stringify(data, null, 2));

    let aiTextRaw =
      data?.candidates?.[0]?.content?.[0]?.text
      ?? data?.output?.candidates?.[0]?.content?.text
      ?? data?.message?.content?.text
      ?? data?.text
      ?? null;

    if (!aiTextRaw) {
      const findString = (obj) => {
        if (typeof obj === 'string') return obj;
        if (Array.isArray(obj)) {
          for (const item of obj) {
            const v = findString(item);
            if (v) return v;
          }
        } else if (obj && typeof obj === 'object') {
          for (const key of Object.keys(obj)) {
            const v = findString(obj[key]);
            if (v) return v;
          }
        }
        return null;
      };
      aiTextRaw = findString(data);
    }

    if (!aiTextRaw) throw new Error('No text found in Gemini response');

    const cleanedText = aiTextRaw.replace(/```json|```/g, '').trim();
    const match = cleanedText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in Gemini response');

    const optimizedProduct = JSON.parse(match[0]);
    return optimizedProduct;

  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    return {
      title: product.title,
      bullets: product.bullets,
      description: product.description,
      keywords: []
    };
  }
}

module.exports = optimizeWithGemini;