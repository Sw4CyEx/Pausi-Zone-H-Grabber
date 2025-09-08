# Pausi Zone-H Grabber - Next.js Version

![Pausi Zone-H Grabber](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

Aplikasi web modern untuk mengambil URL dari Zone-H.org dengan antarmuka yang user-friendly. Versi Next.js dari tool Python "Pausi" yang dikembangkan oleh JavaXploiter.

## 📋 Deskripsi

Pausi Zone-H Grabber adalah aplikasi web yang memungkinkan pengguna untuk mengekstrak domain dari situs Zone-H.org dengan berbagai mode scraping. Aplikasi ini dibangun menggunakan Next.js dengan antarmuka yang responsif dan modern.

## ✨ Fitur Utama

- **🔐 Autentikasi Session**: Menggunakan cookie PHPSESSID dan ZHE untuk akses ke Zone-H
- **👤 Single Notifier**: Mengambil URL dari notifier tertentu
- **👥 Mass Notifier**: Mengambil URL dari beberapa notifier sekaligus
- **⭐ Special Archive**: Scraping dari bagian arsip khusus
- **📁 Full Archive**: Scraping dari seluruh arsip Zone-H
- **📊 Progress Tracking**: Menampilkan progress real-time dengan progress bar
- **💾 Auto Download**: Otomatis membuat file Result.txt yang dapat diunduh
- **🧹 Auto Cleanup**: Menghapus hasil lama saat memulai scraping baru
- **🎨 Dark Theme**: Antarmuka gelap yang modern dan nyaman di mata
- **📱 Responsive Design**: Dapat digunakan di desktop dan mobile

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## 📦 Instalasi

### Prasyarat

- Node.js 18+ 
- npm atau yarn atau pnpm

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/Sw4CyEx/Pausi-Zone-H-Grabber.git
   cd Pausi-Zone-H-Grabber
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

4. **Buka browser**
   ```
   http://localhost:3000
   ```

## 🚀 Cara Penggunaan

### 1. Konfigurasi Session

Sebelum menggunakan aplikasi, Anda perlu mendapatkan cookie session dari Zone-H:

1. Login ke akun Zone-H.org di browser
2. Buka Developer Tools (F12)
3. Pergi ke tab **Application** > **Cookies** > **zone-h.org**
4. Copy nilai dari:
   - `PHPSESSID`
   - `ZHE`
5. Masukkan kedua nilai tersebut di form "Session Configuration"

### 2. Mode Scraping

#### Single Notifier
- Masukkan nama notifier yang ingin di-scrape
- Klik tombol "Grab Single"
- Aplikasi akan mengambil semua URL dari notifier tersebut

#### Mass Notifier
- Masukkan beberapa nama notifier (satu per baris) di textarea
- Klik tombol "Grab Mass"
- Aplikasi akan mengambil URL dari semua notifier yang disebutkan

#### Special Archive
- Klik tombol "Grab Special"
- Mengambil URL dari bagian arsip khusus Zone-H

#### Full Archive
- Klik tombol "Grab Archive"
- Mengambil URL dari seluruh arsip Zone-H (proses paling lama)

### 3. Monitoring Progress

- Progress bar menampilkan persentase penyelesaian
- Status menunjukkan halaman yang sedang diproses
- URL saat ini yang sedang di-scrape ditampilkan secara real-time
- Hasil scraping ditampilkan dalam format list

### 4. Download Hasil

- Setelah scraping selesai, klik tombol "Download Result.txt"
- File akan berisi semua domain yang berhasil diekstrak
- Gunakan tombol "Clear" untuk menghapus hasil dan memulai scraping baru

## 🔧 Konfigurasi

### Environment Variables

Tidak ada environment variables khusus yang diperlukan untuk menjalankan aplikasi ini dalam mode development.

### Deployment

Untuk deployment ke production:

1. **Vercel** (Recommended)
   ```bash
   npm run build
   vercel --prod
   ```

2. **Manual Build**
   ```bash
   npm run build
   npm start
   ```

## 📁 Struktur Project

```
pausi-nextjs/
├── app/
│   ├── api/
│   │   └── scrape/
│   │       └── route.ts          # API endpoint untuk scraping
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page component
├── components/
│   └── ui/                      # shadcn/ui components
├── lib/
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
└── README.md
```

## ⚠️ Disclaimer

- Aplikasi ini dibuat untuk tujuan edukasi dan penelitian
- Pastikan Anda memiliki izin yang sesuai sebelum melakukan scraping
- Gunakan dengan bijak dan patuhi terms of service dari Zone-H.org
- Developer tidak bertanggung jawab atas penyalahgunaan aplikasi ini

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Credits

- **Original Python Version**: JavaXploiter
- **Next.js Conversion**: Sw4CyEx
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide](https://lucide.dev/)

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Buka issue di GitHub repository
2. Pastikan untuk menyertakan detail error dan langkah reproduksi
3. Sertakan screenshot jika memungkinkan

---

**⚡ Built with Next.js and ❤️**
