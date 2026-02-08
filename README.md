# 📦 SCM Enterprise (Supply Chain Management System)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-PERN-blue)
![Status](https://img.shields.io/badge/status-Production_Ready-green)

**SCM Enterprise** adalah solusi manajemen rantai pasok modern yang dirancang untuk membantu bisnis UMKM hingga skala menengah dalam mengelola inventaris, gudang, dan keuangan secara real-time.

Aplikasi ini mencakup siklus bisnis penuh: **Pembelian (Procurement) → Stok Gudang (Inventory) → Penjualan (Sales) → Laporan Keuangan (Financials).**

---

## 🚀 Fitur Utama

### 1. 🏢 Multi-Gudang & Stok

- Manajemen banyak gudang (Warehouse) dalam satu sistem.
- Pelacakan stok real-time per lokasi.
- **Low Stock Alerts:** Notifikasi otomatis jika stok menipis.

### 2. 🚚 Manajemen Rantai Pasok (Supply Chain)

- **Supplier Database:** Kelola data pemasok untuk barang masuk.
- **Customer Database:** Kelola data pelanggan untuk barang keluar.
- Riwayat transaksi lengkap per partner bisnis.

### 3. 💰 Keuangan & Profitabilitas

- **Smart Pricing:** Membedakan Harga Modal (Cost Price) dan Harga Jual (Selling Price).
- **Dashboard Eksekutif:** Menampilkan Total Nilai Aset Gudang (Inventory Value) dan Omzet Penjualan secara otomatis.
- Perhitungan margin keuntungan kotor.

### 4. 📝 Audit & Pelaporan

- **Ledger Transaksi:** Mencatat setiap pergerakan barang (Masuk/Keluar) dengan timestamp, user penanggung jawab, dan harga snapshot saat transaksi terjadi.
- **PDF Invoicing:** Generate Invoice/Faktur Penjualan & Surat Jalan profesional siap cetak langsung dari browser.

### 5. 🔐 Keamanan Enterprise

- Autentikasi aman menggunakan **JWT (JSON Web Token)**.
- Password hashing dengan **Bcrypt**.
- Role-Based Access Control (Admin vs Staff).

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Aplikasi ini dibangun menggunakan **PERN Stack** dengan **TypeScript** untuk ketahanan kode yang maksimal.

### Backend (API)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma ORM
- **Database:** PostgreSQL
- **Auth:** JWT & Bcrypt

### Frontend (Client)

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **PDF Engine:** jsPDF & jspdf-autotable

---

## 📸 Screenshots

_(Tempatkan screenshot aplikasi kamu di sini. Contoh: Dashboard, Halaman Inventory, dan Contoh PDF Invoice)_

| Dashboard | Manajemen Stok |
|Orang |---|
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard+View) | ![Inventory](https://via.placeholder.com/400x200?text=Inventory+View) |

---

## ⚙️ Cara Install & Menjalankan (Local Development)

Ikuti langkah ini untuk menjalankan proyek di komputer lokal Anda.

### Prasyarat

- Node.js (v18+)
- PostgreSQL (Sudah terinstall dan berjalan)

### 1. Clone Repository

```bash
git clone [https://github.com/username-kamu/scm-enterprise.git](https://github.com/username-kamu/scm-enterprise.git)
cd scm-enterprise

2. Setup Backend
Masuk ke folder backend (sesuaikan nama foldernya, misal scm-system):

Bash
cd scm-system
npm install
Buat file .env di dalam folder backend dan isi konfigurasi berikut:

Cuplikan kode
DATABASE_URL="postgresql://user:password@localhost:5432/scm_db?schema=public"
JWT_SECRET="rahasia_super_aman"
PORT=4000
Jalankan migrasi database:

Bash
npx prisma migrate dev --name init
npx prisma generate
Jalankan server:

Bash
npm run dev
3. Setup Frontend
Buka terminal baru, masuk ke folder frontend (misal scm-frontend):

Bash
cd scm-frontend
npm install
Jalankan frontend:

Bash
npm run dev
Buka browser dan akses http://localhost:5173.

📂 Struktur Database (Schema Preview)
Aplikasi ini menggunakan relasi database yang kompleks untuk menjamin integritas data.

User: Admin & Staff.

Warehouse: Lokasi penyimpanan.

Product: Master data barang (SKU, Harga Beli, Harga Jual).

Inventory: Tabel pivot penghubung Produk & Gudang (Many-to-Many).

Supplier & Customer: Entitas eksternal.

StockMovement: Tabel log (Audit Trail) yang mencatat sejarah transaksi.

🤝 Kontribusi
Kontribusi selalu diterima! Silakan buat Pull Request atau buka Issue jika menemukan bug atau ingin menambahkan fitur baru.

📄 Lisensi
Proyek ini dilisensikan di bawah MIT License.

Dibuat dengan oleh Muhammad Azfa Asykarulloh
```
