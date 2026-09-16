# Market of Abu - Curated Fashion & Lifestyle Marketplace

Market of Abu adalah platform e-commerce & marketplace fashion modern, elegan, dan terkurasi dengan dukungan penuh bilingual (**Bahasa Indonesia 🇮🇩** & **English 🇬🇧**) lengkap dengan **Backend RESTful API berbasis Node.js & Express**.

---

## 🌟 Fitur Unggulan (Key Features)

### 🎨 Frontend:
- 🌐 **Bilingual System (ID 🇮🇩 & EN 🇬🇧)**:
  - Toggle bahasa instan di header (`ID` / `EN`).
  - Terjemahan dinamis otomatis untuk seluruh konten website.
  - Penyesuaian mata uang otomatis (Rupiah `Rp` & USD `$`).
- 📸 **Kurasi Foto High-Resolution**: Foto bertema editorial fashion dari Unsplash.
- 📦 **Pelacakan Pesanan Real-Time (Live Order Tracking)**:
  - Input Order ID (contoh: `ABU-10824`) untuk melihat status dan timeline pengiriman (Diterima ➔ Lunas ➔ Dikemas ➔ Dikirim ➔ Selesai).
  - Terintegrasi dengan nomor resi dan nama kurir ekspedisi prioritas.
- 🔍 **Pencarian Live & Autocomplete Suggestions**:
  - Pratinjau instan foto, nama, brand, dan harga produk saat mengetik.
  - Filter kategori (Wanita, Pria, Sepatu, Aksesoris) dan pengurutan harga/rating.
- 🛍️ **Keranjang Belanja Interaktif (Slide-out Cart)**:
  - Atur jumlah item (`+` / `-`), hapus produk, perhitungan subtotal dan pengiriman gratis.
  - **Sistem Voucher**: Masukkan kode promo `ABUHEMAT` atau `SUMMER50` untuk mendapatkan diskon 50% instan.
- 👁️ **Quick View Modal**: Detail spesifikasi, pilihan ukuran (S, M, L, XL), warna, dan ulasan.
- ❤️ **Sistem Wishlist (Favorit)**: Simpan produk favorit dengan badge counter di navbar.
- 💬 **Sistem Ulasan Pelanggan Dinamis**:
  - Pelanggan dapat menulis ulasan baru dengan rating bintang (1-5), nama, dan kota yang tersimpan di server.
- 📐 **Panduan Ukuran (Size Guide Modal)**: Tabel ukuran lengkap untuk busana pria, wanita, dan sepatu.
- 🔄 **Kebijakan Retur 30 Hari & FAQ Accordion**: Informasi retur dan tanya-jawab interaktif.
- 💾 **Penyimpanan Lokal (localStorage)**: Keranjang, wishlist, dan preferensi bahasa tersimpan otomatis di browser pengguna.
- 🟢 **Floating WhatsApp CS & Back-to-Top**: Tombol bantuan WhatsApp 24/7 dan tombol kembali ke atas.

### ⚙️ Backend (Node.js & Express REST API):
- 📦 **Products API**:
  - `GET /api/products`: Katalog produk dengan filter `?category=`, pencarian `?q=`, dan pengurutan `?sort=`.
  - `GET /api/products/:id`: Detail produk.
  - `POST /api/products`: Tambah produk baru.
- 🔍 **Search Suggest API**:
  - `GET /api/search/suggest?q=...`: Autocomplete pencarian instan.
- 📦 **Order Tracking API**:
  - `POST /api/orders`: Pembuatan pesanan checkout baru dan pembuatan Order ID unik (`ABU-XXXXX`).
  - `GET /api/orders/:id`: Detail pelacakan pesanan lengkap dengan timeline.
  - `GET /api/orders`: Riwayat semua pesanan.
- ⭐ **Reviews API**:
  - `GET /api/reviews`: Daftar ulasan pelanggan.
  - `POST /api/reviews`: Kirim ulasan baru pelanggan.
- 🏷️ **Categories API**:
  - `GET /api/categories`: Daftar kategori dan jumlah item.
- 🎟️ **Vouchers API**:
  - `POST /api/vouchers/validate`: Validasi kupon promo (`ABUHEMAT`, `SUMMER50`).
- ✉️ **Newsletter API**:
  - `POST /api/newsletter`: Pendaftaran email newsletter pelanggan.
- 📊 **Stats API**:
  - `GET /api/stats`: Statistik ringkasan marketplace.
- 💾 **Penyimpanan Persisten**: Database JSON (`data/products.json`, `data/orders.json`, `data/reviews.json`, `data/subscribers.json`).

---

## 🚀 Cara Menjalankan (Getting Started)

### 1. Menjalankan Fullstack (Server + Frontend):
```bash
# 1. Install dependensi (hanya pertama kali)
npm install

# 2. Jalankan server
npm start
```
Buka browser di:
- **Aplikasi Web**: [http://localhost:3000](http://localhost:3000)
- **API Health**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 2. Menjalankan Standalone (Frontend Saja):
Klik dua kali file `index.html` di browser apa pun. Seluruh fitur dilengkapi *smart offline fallback* sehingga tetap berfungsi mulus tanpa server.

---

## 📁 Struktur Proyek (Directory Structure)

```
market-place/
├── data/
│   ├── products.json      # Database katalog produk
│   ├── orders.json        # Database pesanan pelanggan
│   ├── reviews.json       # Database ulasan pembeli
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
