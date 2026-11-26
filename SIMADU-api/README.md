# SIMADU API - Sistem Layanan Informasi dan Pengaduan Mahasiswa

REST API aman, terstruktur, dan berlapis berbasis Node.js dan Express 5 untuk layanan pengaduan mahasiswa di lingkungan perguruan tinggi. Proyek ini dibangun sebagai pemenuhan Ujian Tengah Semester (UTS) mata kuliah Web Service Engineering, Program Studi Teknologi Informasi.

# Prasyarat Sistem

1. Node.js versi 18 atau lebih baru (disarankan Node.js 20 atau 24)
2. NPM (Node Package Manager) versi 9 atau lebih baru
3. Peramban web modern (Google Chrome, Microsoft Edge, atau Mozilla Firefox) untuk mengakses Swagger UI

# Instalasi dan Konfigurasi

Langkah 1: Masuk ke direktori proyek
cd "D:\wse uts\simadu-api"

Langkah 2: Salin file konfigurasi lingkungan
Salin file .env.example menjadi .env

Langkah 3: Pasang dependensi proyek
Jalankan perintah berikut:
npm install

# Cara Menjalankan Server

1. Menjalankan server dalam mode produksi atau standar:
npm start
atau
node server.cjs

Server akan aktif pada alamat:
http://localhost:3000

2. Mengakses Dokumentasi Interaktif Swagger UI:
Buka peramban web dan arahkan ke alamat:
http://localhost:3000/docs
atau
http://localhost:3000/api-docs

# Cara Menjalankan Pengujian Otomatis

Proyek ini telah dilengkapi skrip pengujian otomatis yang mencakup 12 skenario pengujian fungsional dan keamanan wajib:
npm test
atau
node tests/test-runner.cjs

# Arsitektur dan Pembagian Tanggung Jawab Komponen

Proyek SIMADU API menerapkan arsitektur berlapis (layered architecture) dengan pemisahan tanggung jawab yang jelas:

1. Router (src/routes/)
Tanggung jawab: Menerima permintaan HTTP yang masuk, memetakan URL dan metode HTTP ke controller yang sesuai, serta menempelkan middleware autentikasi dan validasi. Router tidak memproses logika bisnis maupun query data.

2. Middleware (src/middleware/)
Tanggung jawab: Melakukan verifikasi autentikasi token Bearer JWT (authMiddleware.cjs), validasi format dan tipe data input serta penyaringan field terlarang (validateMiddleware.cjs), dan menangani error secara terpusat tanpa membocorkan data sensitif (errorHandler.cjs).

3. Controller (src/controllers/)
Tanggung jawab: Menangani siklus request dan response HTTP. Controller mengekstrak parameter, headers, dan body yang sudah tervalidasi, memanggil metode yang relevan pada service layer, lalu mengembalikan respons dengan kode status HTTP yang tepat (200, 201, dll).

4. Service (src/services/)
Tanggung jawab: Mengelola seluruh logika bisnis inti dan aturan keamanan aplikasi. Memeriksa hak kepemilikan data (data ownership), memverifikasi role pengguna, memastikan pengaduan yang sedang diproses atau selesai tidak dapat dimodifikasi atau dihapus sembarangan, serta mengomputasi token autentikasi.

5. Repository (src/repositories/)
Tanggung jawab: Berperan sebagai lapisan akses data (Data Access Layer). Bertanggung jawab langsung terhadap operasi CRUD pada sumber data (in-memory store atau basis data). Lapisan lain tidak diizinkan mengubah penyimpanan data secara langsung tanpa melalui repository.

# Akun Pengguna Uji Coba

Untuk keperluan demonstrasi dan pengujian kontrol akses:

1. Mahasiswa 1
Username: mhs01
Password: mhs123
Role: mahasiswa
Nama: Zayn

2. Mahasiswa 2
Username: mhs02
Password: mhs123
Role: mahasiswa
Nama: Budi Santoso

3. Administrator
Username: admin01
Password: admin123
Role: admin
Nama: Administrator SIMADU
