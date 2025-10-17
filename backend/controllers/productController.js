const puppeteer = require('puppeteer');
const Product = require('../models/product');
const optimizeWithGemini = require('../utils/gemini');

async function fetchProductData(asin) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`https://www.amazon.com/dp/${asin}`, { waitUntil: 'domcontentloaded' });

  const data = await page.evaluate(() => {
    const title = document.querySelector('#productTitle')?.innerText.trim() || '';
    const bullets = Array.from(document.querySelectorAll('#feature-bullets li')).map(li => li.innerText.trim());
    const description = document.querySelector('#productDescription')?.innerText.trim() || '';
    return { title, bullets, description };
  });

  await browser.close();
  console.log(data);
  return data;
}

async function optimizeProduct(req, res) {
  try {
    const { asin } = req.body;
    const original = await fetchProductData(asin);
    const optimized = await optimizeWithGemini(original);

    await Product.create({
      asin,
      original_title: original.title,
      original_bullets: original.bullets.join('|'),
      original_description: original.description,
      optimized_title: optimized.title,
      optimized_bullets: optimized.bullets.join('|'),
      optimized_description: optimized.description,
      keywords: optimized.keywords.join('|')
    });

    res.json({ original, optimized });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to optimize product' });
  }
}

async function getHistory(req, res) {
  const { asin } = req.params;
  const history = await Product.findAll({ where: { asin } });
  res.json(history);
}



module.exports = { optimizeProduct, getHistory };
