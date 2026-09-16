# Market of Abu - Curated Fashion & Lifestyle Marketplace

Market of Abu adalah platform e-commerce & marketplace fashion modern, elegan, dan terkurasi dengan dukungan penuh bilingual (**Bahasa Indonesia 🇮🇩** & **English 🇬🇧**) lengkap dengan **Backend RESTful API berbasis Node.js & Express**.

---

## 🌟 Fitur Utama (Key Features)

### Frontend:
- 🌐 **Bilingual System (ID 🇮🇩 & EN 🇬🇧)**:
  - Toggle bahasa instan di header.
  - Seluruh teks, banner, kategori, detail produk, keranjang, hingga konfirmasi checkout otomatis beradaptasi.
  - Penyesuaian format mata uang otomatis (Rupiah `Rp` & USD `$`).
- 📸 **Kurasi Foto High-Resolution**: Foto asli bertema editorial fashion dari Unsplash.
- 🛍️ **Keranjang Belanja Interaktif (Slide-out Cart)**:
  - Pengaturan jumlah item (`+` / `-`), hapus produk, perhitungan subtotal dan pengiriman gratis.
  - **Sistem Voucher**: Masukkan kode promo `ABUHEMAT` atau `SUMMER50` untuk mendapatkan diskon 50% instan.
- 🔍 **Pencarian Live & Filter Kategori**: Filter instan berdasarkan kategori (Wanita, Pria, Sepatu, Aksesoris) dan pengurutan harga/rating.
- 👁️ **Quick View Modal**: Detail spesifikasi, pilihan ukuran (S, M, L, XL), warna, dan ulasan bintang.
- ❤️ **Sistem Wishlist (Favorit)**: Simpan produk favorit dengan badge counter di navbar.
- 💳 **Modal Checkout Multi-Payment**: Pilihan QRIS Instant, E-Wallet (GoPay/OVO), Virtual Account (BCA/Mandiri), dan Kartu Kredit.
- ⏳ **Real-Time Countdown Timer**: Flash sale counter detik-demi-detik yang aktif setiap detik.

### Backend (Node.js & Express REST API):
- 📦 **Products API**:
  - `GET /api/products`: Mendapatkan semua produk dengan filter `?category=`, `?q=`, dan `?sort=price-low|price-high|rating`.
  - `GET /api/products/:id`: Detail produk berdasarkan ID.
  - `POST /api/products`: Menambahkan produk baru ke katalog.
- 🏷️ **Categories API**:
  - `GET /api/categories`: Daftar kategori beserta jumlah koleksi produk.
- 🎟️ **Vouchers API**:
  - `POST /api/vouchers/validate`: Validasi kupon diskon (contoh: `ABUHEMAT`).
- 🧾 **Orders API**:
  - `POST /api/orders`: Menyimpan pesanan checkout pelanggan dan membuat nomor pesanan unik (`ABU-XXXXX`).
  - `GET /api/orders/:id`: Melacak detail pesanan berdasarkan Order ID.
  - `GET /api/orders`: Melihat riwayat semua pesanan.
- ✉️ **Newsletter API**:
  - `POST /api/newsletter`: Menyimpan pendaftaran email pelanggan.
- 📊 **Stats API**:
  - `GET /api/stats`: Statistik total produk, pesanan, dan rating toko.
- 💾 **Penyimpanan Persisten**: Database berbasis JSON (`data/products.json`, `data/orders.json`, `data/subscribers.json`) yang siap pakai tanpa instalasi database eksternal rumit.

---

## 🚀 Cara Menjalankan (Getting Started)

### 1. Menjalankan Fullstack (Backend Server + Frontend):
Pastikan Node.js sudah terpasang, lalu jalankan perintah berikut di terminal:

```bash
# 1. Install dependensi (hanya pertama kali)
npm install

# 2. Jalankan server
npm start
```

Buka browser Anda di:
- **Website**: [http://localhost:3000](http://localhost:3000)
- **REST API Base**: [http://localhost:3000/api](http://localhost:3000/api)

### 2. Menjalankan Mode Standalone (Frontend Saja):
Anda juga dapat langsung membuka file `index.html` dengan mengklik dua kali di file manager. Website dilengkapi dengan sistem *graceful offline fallback* sehingga seluruh fitur tetap berjalan mulus tanpa server.

---

## 📁 Struktur Proyek (Directory Structure)

```
market-place/
├── data/
│   ├── products.json      # Database katalog produk
│   ├── orders.json        # Database pesanan pelanggan
│   └── subscribers.json   # Database email newsletter
├── index.html             # Tampilan web responsif & bilingual
├── server.js              # Express REST API Server
├── package.json           # Konfigurasi dependensi Node.js
├── .gitignore             # File exclusion git
└── README.md              # Dokumentasi proyek
```

---

## 📄 Lisensi
Hak Cipta © 2026 **Market of Abu**. All rights reserved.
