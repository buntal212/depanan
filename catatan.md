# Catatan Pemeriksaan Frontend Jangur

Tanggal pemeriksaan: 7 Agustus 2026

## Ringkasan

Project ini adalah aplikasi frontend SPA untuk toko bangunan, dibangun dengan Vue 3 dan Quasar. Struktur dasarnya sudah cukup rapi: halaman dipisahkan berdasarkan fitur, akses API diletakkan di Pinia store, komponen umum diregistrasi secara global, serta route memakai lazy loading.

Kondisi saat diperiksa:

- `npm run lint`: **lulus tanpa error**.
- `npm run build`: **berhasil** dan menghasilkan `dist/spa`.
- Automated test dasar tersedia dan seluruh 3 test lulus.
- Terdapat 74 file sumber: 42 file Vue dan 28 file JavaScript.

## Teknologi utama

- Vue 3.4 dengan Composition API
- Quasar 2 / Quasar App Vite
- Pinia 2 dan `pinia-plugin-persistedstate`
- Vue Router 4
- Axios untuk komunikasi API
- Vue I18n
- ExcelJS untuk ekspor/olah workbook pada dashboard
- ESLint dan Prettier

Konfigurasi backend menggunakan environment variable `VITE_SERV`. Nilainya sengaja tidak dicantumkan dalam catatan ini.

## Modul yang tersedia

- Autentikasi/login dan profil
- Dashboard
- Master barang
- Master pegawai
- Master satuan
- Master pelanggan
- Master supplier
- Transaksi order barang/pembelian
- Menu admin dinamis dari endpoint backend
- Dark mode yang disimpan melalui persisted Pinia state

## Temuan prioritas tinggi

### 1. Login belum merupakan autentikasi sungguhan

Form login belum memakai `v-model`, jadi username dan password tidak pernah masuk ke state. Method `login()` hanya mengubah `auth` menjadi `true` di browser tanpa request ke backend. Karena state Pinia dipersist, siapa pun dapat memperoleh akses tampilan admin dengan memanipulasi local storage.

Saran: hubungkan login ke endpoint backend, simpan token/session yang valid, ambil profil pengguna, validasi session ketika aplikasi dimuat, dan bersihkan seluruh data autentikasi saat logout. Route guard frontend hanya untuk UX; otorisasi tetap wajib ditegakkan backend.

### 2. Header API awal berisi `Bearer null`

Di `src/boot/axios.js`, header `Authorization` langsung dibuat dari token yang bernilai `null`. Akibatnya request awal dapat mengirim `Authorization: Bearer null`.

Saran: jangan pasang header ketika token kosong. Tambahkan request interceptor untuk mengambil token aktif dan response interceptor untuk menangani `401/403` secara konsisten.

### 3. File `.env` belum diabaikan Git

`.gitignore` hanya mengabaikan `.env.local*`, bukan `.env`. Ini berisiko membuat alamat internal atau secret ikut ter-commit. Semua variable berawalan `VITE_` juga masuk ke bundle browser, sehingga **tidak boleh berisi secret**.

Saran: tambahkan `.env` ke `.gitignore`, buat `.env.example` berisi nama key tanpa nilai sensitif, lalu periksa riwayat Git apabila file pernah ter-commit.

### 4. Bug pembaruan data barang

Pada store form barang, hasil `arr.items.map(...)` saat edit tidak ditugaskan kembali ke `arr.items`. Data hasil edit kemungkinan tidak langsung berubah di daftar sampai data diambil ulang.

Saran: gunakan `arr.items = arr.items.map(...)` atau cari indeks item lalu ganti item tersebut secara eksplisit.

### 5. Hapus barang dilakukan sebelum API berhasil

Item barang difilter dari daftar sebelum request hapus selesai, lalu difilter kembali setelah sukses. Bila API gagal, item tetap hilang dari tampilan walaupun kemungkinan masih ada di server.

Saran: hapus dari state hanya setelah response sukses, atau simpan snapshot dan rollback state ketika request gagal. Pastikan payload hapus juga sesuai kontrak API; saat ini angka `id` dikirim langsung sebagai body.

## Temuan prioritas menengah

- Banyak `console.log` aktif di boot routing, layout, store master, dan transaksi. Beberapa log mencetak form maupun response API dan berpotensi membocorkan data di production.
- Pesan default `notifError()` masih berbunyi `Sucees!, Wow Kerja Bagus!`, sehingga notifikasi error dapat menampilkan pesan sukses.
- Penamaan endpoint belum konsisten, misalnya daftar barang memakai `/v1/coba/barang/list`, sedangkan simpan/hapus memakai `/v1/master/barang/...`.
- Error handling tersebar dan tidak konsisten. Sebagian hanya `console.log`, sebagian mengubah `isError`, dan sebagian menampilkan notifikasi.
- Store app dan menu dipersist seluruhnya. Data menu dari backend dapat menjadi basi setelah role atau izin pengguna berubah.
- `router.beforeEach` masih memakai pola callback `next`; dapat disederhanakan dengan return route agar alurnya lebih mudah diuji.
- Route anak menggunakan path absolut. Ini valid, tetapi mengurangi manfaat nesting dan mudah membingungkan saat prefix layout berubah.
- Tidak ada validasi kredensial pada form login maupun penanganan loading/error login.
- Sejumlah kode template/contoh masih tertinggal, seperti `example-store.js`, komentar bawaan Quasar, dan import/nonaktif yang tidak diperlukan.

## Build dan performa

Build production berhasil. Setelah optimasi, ExcelJS terpisah dari chunk halaman dan hanya dimuat saat ekspor dijalankan. Build masih memberikan beberapa peringatan:

- Chunk ExcelJS sekitar 897,53 KB sebelum gzip (230 KB gzip), melewati batas peringatan 500 KB tetapi tidak lagi membebani pemuatan awal dashboard.
- Total JavaScript hasil build sekitar 1,51 MB sebelum gzip.
- ExcelJS menggunakan direct `eval` pada bundle distribusinya; peringatan berasal dari dependency.
- Database Browserslist/caniuse-lite telah diperbarui ke versi terbaru saat pemeriksaan.
- `src/boot/axios.js` di-import sebagai boot module sekaligus secara statis oleh banyak store, sehingga dynamic import tidak memisahkannya menjadi chunk lain.

Chunk besar berasal dari ExcelJS dan sekarang sudah dipisahkan dengan dynamic import. Peringatan direct `eval` tetap berasal dari distribusi dependency tersebut.

Audit dependency setelah `npm audit fix` tidak lagi menemukan kerentanan high/critical. Masih ada 2 low dan 2 moderate dari rantai dependency Quasar/esbuild dan ExcelJS/uuid yang belum dapat diperbaiki otomatis tanpa override versi berisiko.

## Kualitas dan maintainability

Hal yang sudah baik:

- Lint bersih dan build production berhasil.
- Pemisahan halaman, komponen, store list, dan store form cukup jelas.
- Route halaman memakai lazy import.
- Komponen input/tombol umum sudah mulai distandardisasi.
- Loading dan error state sudah tersedia pada sebagian besar store list.

Yang sebaiknya distandardisasi:

- Buat satu lapisan API/service atau helper request untuk response, error, dan notifikasi.
- Gunakan pola CRUD yang sama pada semua master data.
- Tambahkan formatter/linter ke CI.
- Tambahkan unit test untuk store dan utilitas, serta minimal satu end-to-end test untuk login dan CRUD utama.
- Gunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })` untuk format rupiah agar lebih aman daripada rangkaian regex manual.
- Hindari `getNewLine()` yang menghasilkan HTML bila output digunakan dengan `v-html`, atau lakukan sanitasi untuk mencegah XSS.

## Status tindak lanjut

Perbaikan frontend dilakukan pada 7 Agustus 2026:

- Login lokal palsu telah diganti dengan request API berbasis token.
- Pengelolaan token, interceptor request, dan penanganan `401` telah ditambahkan.
- Form login kini memiliki binding, validasi, loading, dan pesan error.
- `.env` telah ditambahkan ke `.gitignore` dan `.env.example` telah dibuat.
- Bug update dan hapus barang telah diperbaiki.
- Pesan notifikasi error serta log aktif telah dibersihkan.
- ExcelJS kini dimuat secara dinamis hanya saat ekspor dijalankan.
- Store contoh telah dihapus dan test utilitas dasar telah ditambahkan.

Backend di `../belakangan` sekarang menyediakan autentikasi Laravel Sanctum melalui endpoint login, logout, dan profil yang sesuai dengan `.env.example`.

## Catatan pemeriksaan

Pemeriksaan ini bersifat statis ditambah lint, unit test, audit dependency, dan build. Endpoint autentikasi backend sudah dibuat, tetapi belum dapat dijalankan dari lingkungan pemeriksaan karena executable PHP tidak tersedia di PATH. Command `git` juga tidak tersedia di PATH pada lingkungan pemeriksaan, sehingga status tracking `.env` dan riwayat commit belum dapat dipastikan dari Git.

---

## Catatan sesi terakhir — 7 Agustus 2026

### Koneksi frontend dan backend

- Frontend development diarahkan ke backend toko bangunan `http://localhost:8183` melalui `quasar.config.js`.
- Axios tetap memakai base path `/api`; login menggunakan `POST /api/login` sesuai kontrak frontend.
- Backend ditambahkan route kompatibilitas login `/api/login`.
- Dependency frontend disinkronkan; masalah import `vue3-print-nb` selesai.
- URL QR absensi tidak lagi hardcode ke port `8182`, tetapi mengikuti nilai `SERV`.

### Optimasi frontend

- Kebocoran activity listener pada store app diperbaiki dengan referensi handler yang stabil.
- Reset inactivity timer dibatasi maksimal sekali per detik.
- Persisted state app dibatasi hanya untuk `dark`, `auth`, `user`, dan `token`.
- Inisialisasi timer, listener, dan navigasi ganda setelah login dihapus.
- Komponen global sekarang menggunakan lazy loading dan tidak lagi mengimpor seluruh Lodash.
- Chunk boot global component turun dari sekitar 113 KB menjadi sekitar 2,7 KB.
- Referensi favicon diganti ke file kecil sesuai ukuran.

### Dashboard terbaru

- Dashboard menggunakan background hitam (`#050505`) dan panel hitam (`#111111`).
- Grafik selalu memakai tema gelap agar label tetap terbaca pada semua mode aplikasi.
- Dashboard memiliki kartu ringkasan:
  - total pendapatan;
  - jumlah transaksi;
  - jumlah produk;
  - jumlah pelanggan.
- Grafik yang tersedia:
  - penjualan bulanan tahun berjalan dibanding tahun sebelumnya;
  - 10 produk terlaris;
  - status transaksi dalam diagram donat;
  - tren penjualan tahun berjalan.
- Diagram donat kategori produk sudah diganti dengan informasi yang lebih penting, yaitu status transaksi: Pesanan, Belum Dicicil, Proses Cicilan, Dibawa Sales, Lunas, dan Batal.
- Ditambahkan tabel delapan transaksi terbaru berisi nomor penjualan, tanggal, pelanggan, total, dan status.
- Dashboard memiliki loading skeleton, pesan kegagalan, tombol coba lagi, dan tombol muat ulang.

### Endpoint dashboard baru

Backend `../belakangan` sekarang memiliki endpoint:

```text
GET /api/v1/dashboard
```

Route dilindungi middleware `auth:sanctum`. Endpoint mengembalikan data database nyata dalam satu request:

- `summary`;
- `monthlySales`;
- `topProducts`;
- `statusDistribution`;
- `recentSales`.

Controller berada di:

```text
../belakangan/app/Http/Controllers/Api/DashboardController.php
```

Route berada di:

```text
../belakangan/routes/v1/dashboard.php
```

Store frontend berada di:

```text
src/stores/admin/dashboard/index.js
```

Tidak ada lagi angka dummy pada dashboard. Jika endpoint gagal, nilai tetap kosong/zero dan UI menampilkan pesan error.

### Verifikasi terakhir

- PHP controller dashboard lolos `php -l`.
- Route `api/v1/dashboard` terdaftar.
- Endpoint dashboard tanpa token menghasilkan HTTP `401`, sesuai proteksi Sanctum.
- `npm run lint` berhasil.
- `npm run build` berhasil.

### Saat melanjutkan nanti

- Login ulang dan cek dashboard menggunakan data produksi lokal pada port `8183`.
- Validasi apakah definisi transaksi sah (`flag` bukan null dan bukan `6`) sudah sesuai kebutuhan bisnis untuk omzet dan grafik penjualan.
- Bila diperlukan, tambahkan filter periode/tahun pada endpoint serta UI dashboard.
- Periksa tampilan responsif tabel transaksi terbaru pada layar HP.
