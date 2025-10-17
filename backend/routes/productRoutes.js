const express = require('express');
const router = express.Router();
const { optimizeProduct, getHistory } = require('../controllers/productController');

router.post('/optimize', optimizeProduct);
router.get('/history/:asin', getHistory);

module.exports = router;
