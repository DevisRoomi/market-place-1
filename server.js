const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname)));

// File Paths
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const SUBSCRIBERS_FILE = path.join(__dirname, 'data', 'subscribers.json');
const REVIEWS_FILE = path.join(__dirname, 'data', 'reviews.json');

// Helper functions for persistent JSON reading/writing
function readData(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return [];
    }
}

function writeData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error(`Error writing ${filePath}:`, err);
        return false;
    }
}

// ==================== REST API ENDPOINTS ====================

// 1. Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        app: 'Market of Abu API',
        version: '1.2.0',
        timestamp: new Date().toISOString()
    });
});

// 2. Get Products (with search, category filter, sort)
app.get('/api/products', (req, res) => {
    let products = readData(PRODUCTS_FILE);
    const { category, q, sort } = req.query;

    // Filter by Category
    if (category && category !== 'all') {
        products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Search keyword
    if (q) {
        const query = q.toLowerCase().trim();
        products = products.filter(p => 
            p.name.id.toLowerCase().includes(query) ||
            p.name.en.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query)
        );
    }

    // Sorting
    if (sort === 'price-low') {
        products.sort((a, b) => a.priceIDR - b.priceIDR);
    } else if (sort === 'price-high') {
        products.sort((a, b) => b.priceIDR - a.priceIDR);
    } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
    }

    res.json({
        success: true,
        count: products.length,
        data: products
    });
});

// 3. Search Autocomplete Suggestions
app.get('/api/search/suggest', (req, res) => {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
        return res.json({ success: true, data: [] });
    }

    const query = q.toLowerCase().trim();
    const products = readData(PRODUCTS_FILE);
    const matches = products.filter(p => 
        p.name.id.toLowerCase().includes(query) ||
        p.name.en.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
    ).slice(0, 6).map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        priceIDR: p.priceIDR,
        priceUSD: p.priceUSD,
        image: p.image
    }));

    res.json({
        success: true,
        data: matches
    });
});

// 4. Get Product by ID
app.get('/api/products/:id', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Produk tidak ditemukan / Product not found'
        });
    }

    res.json({
        success: true,
        data: product
    });
});

// 5. Create New Product
app.post('/api/products', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const newProduct = req.body;

    if (!newProduct.name || !newProduct.priceIDR) {
        return res.status(400).json({
            success: false,
            message: 'Nama dan harga produk wajib diisi'
        });
    }

    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productToSave = {
        id: nextId,
        ...newProduct,
        rating: newProduct.rating || 5.0,
        reviewsCount: 0,
        createdAt: new Date().toISOString()
    };

    products.push(productToSave);
    writeData(PRODUCTS_FILE, products);

    res.status(201).json({
        success: true,
        message: 'Produk berhasil ditambahkan',
        data: productToSave
    });
});

// 6. Get Categories & Collection Counts
app.get('/api/categories', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const categoryCounts = {
        women: products.filter(p => p.category === 'women').length,
        men: products.filter(p => p.category === 'men').length,
        shoes: products.filter(p => p.category === 'shoes').length,
        accessories: products.filter(p => p.category === 'accessories').length
    };

    res.json({
        success: true,
        data: [
            { id: 'women', name: { id: 'Pakaian Wanita', en: "Women's Clothing" }, count: categoryCounts.women },
            { id: 'men', name: { id: 'Pakaian Pria', en: "Men's Clothing" }, count: categoryCounts.men },
            { id: 'shoes', name: { id: 'Sepatu & Sneakers', en: 'Shoes & Sneakers' }, count: categoryCounts.shoes },
            { id: 'accessories', name: { id: 'Aksesoris & Tas', en: 'Bags & Accessories' }, count: categoryCounts.accessories }
        ]
    });
});

// 7. Validate Promo Voucher
app.post('/api/vouchers/validate', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            success: false,
            message: 'Kode voucher harus diisi'
        });
    }

    const voucherCode = code.trim().toUpperCase();
    const validVouchers = {
        'ABUHEMAT': { discountPercent: 50, description: 'Diskon Spesial 50% All Items' },
        'SUMMER50': { discountPercent: 50, description: 'Diskon Spesial Musim Panas 50%' },
        'ABU10': { discountPercent: 10, description: 'Diskon Selamat Datang 10%' }
    };

    if (validVouchers[voucherCode]) {
        return res.json({
            success: true,
            valid: true,
            code: voucherCode,
            discountPercent: validVouchers[voucherCode].discountPercent,
            discountMultiplier: validVouchers[voucherCode].discountPercent / 100,
            description: validVouchers[voucherCode].description
        });
    } else {
        return res.status(404).json({
            success: false,
            valid: false,
            message: 'Kode voucher tidak valid atau sudah kedaluwarsa'
        });
    }
});

// 8. Create New Order (Checkout)
app.post('/api/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const { customer, items, subtotalIDR, discountIDR, totalIDR, voucherCode, paymentMethod } = req.body;

    if (!customer || !customer.name || !customer.phone || !items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Data pemesanan atau item keranjang tidak lengkap'
        });
    }

    // Generate unique Order ID e.g. ABU-64821
    const orderId = 'ABU-' + Math.floor(10000 + Math.random() * 90000);
    const trackingResi = 'MOA-EXP-' + Math.floor(10000000 + Math.random() * 90000000);

    const newOrder = {
        orderId,
        trackingResi,
        courier: 'J&T Express Priority (Gratis Ongkir)',
        customer,
        items,
        subtotalIDR: Number(subtotalIDR) || 0,
        discountIDR: Number(discountIDR) || 0,
        totalIDR: Number(totalIDR) || 0,
        voucherCode: voucherCode || null,
        paymentMethod: paymentMethod || 'QRIS',
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING', // PROCESSING, PACKED, SHIPPED, DELIVERED
        timeline: [
            { step: 1, title: 'Pesanan Diterima', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), done: true },
            { step: 2, title: 'Pembayaran Lunas', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), done: true },
            { step: 3, title: 'Sedang Dikemas di Gudang Abu', time: 'Estimasi: Hari Ini', done: true },
            { step: 4, title: 'Dalam Pengiriman Kurir', time: 'Estimasi: 1-2 Hari', done: false },
            { step: 5, title: 'Pesanan Diterima Pelanggan', time: 'Estimasi: 2-3 Hari', done: false }
        ],
        createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder); // newest first
    writeData(ORDERS_FILE, orders);

    res.status(201).json({
        success: true,
        message: 'Pesanan berhasil dibuat',
        data: newOrder
    });
});

// 9. Track Order by Order ID (Rich detail)
app.get('/api/orders/:id', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const searchId = req.params.id.trim().toUpperCase();
    const order = orders.find(o => o.orderId.toUpperCase() === searchId || (o.trackingResi && o.trackingResi.toUpperCase() === searchId));

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Nomor pesanan tidak ditemukan. Periksa kembali Order ID Anda (contoh: ABU-10824).'
        });
    }

    res.json({
        success: true,
        data: order
    });
});

// 10. List All Orders
app.get('/api/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    res.json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// 11. Customer Reviews API
app.get('/api/reviews', (req, res) => {
    const reviews = readData(REVIEWS_FILE);
    res.json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

app.post('/api/reviews', (req, res) => {
    const { name, city, rating, comment } = req.body;
    if (!name || !comment) {
        return res.status(400).json({
            success: false,
            message: 'Nama dan isi ulasan wajib diisi'
        });
    }

    const reviews = readData(REVIEWS_FILE);
    const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
    
    // Default avatar based on random seed
    const avatarSeeds = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    ];
    const chosenAvatar = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)];

    const newReview = {
        id: newId,
        name: name.trim(),
        role: {
            id: `${city || 'Indonesia'} • Pembeli Terverifikasi`,
            en: `${city || 'Indonesia'} • Verified Buyer`
        },
        avatar: chosenAvatar,
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: {
            id: comment.trim(),
            en: comment.trim()
        },
        createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    writeData(REVIEWS_FILE, reviews);

    res.status(201).json({
        success: true,
        message: 'Ulasan Anda berhasil dikirim dan dipublikasikan!',
        data: newReview
    });
});

// 12. Subscribe Newsletter
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return res.status(400).json({
            success: false,
            message: 'Alamat email tidak valid'
        });
    }

    const subscribers = readData(SUBSCRIBERS_FILE);
    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
        subscribers.push({
            email: email.toLowerCase().trim(),
            subscribedAt: new Date().toISOString()
        });
        writeData(SUBSCRIBERS_FILE, subscribers);
    }

    res.json({
        success: true,
        message: 'Terima kasih telah berlangganan newsletter Market of Abu!'
    });
});

// 13. General Store Statistics
app.get('/api/stats', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const orders = readData(ORDERS_FILE);
    const subscribers = readData(SUBSCRIBERS_FILE);
    const reviews = readData(REVIEWS_FILE);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 4.9;

    res.json({
        success: true,
        data: {
            totalProducts: products.length,
            totalOrders: orders.length,
            totalSubscribers: subscribers.length,
            totalReviews: reviews.length,
            storeRating: Number(avgRating),
            activePromo: 'ABUHEMAT (Diskon 50%)'
        }
    });
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Market of Abu Server is running on:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`📦 REST API Base: http://localhost:${PORT}/api`);
    console.log(`=================================================\n`);
});
