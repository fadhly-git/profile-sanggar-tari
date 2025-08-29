import { cn } from "@/lib/utils";

export const dhaf = "mailto:hallo@fadh.my.id?subject=Feedback Pengembangan Website Company Profile dengan CMS&body=Yth. Tim Pengembangan Website%0D%0A%0D%0ADengan hormat,%0D%0A%0D%0ASaya ingin menyampaikan hasil evaluasi dan masukan terhadap pengembangan aplikasi website company profile berbasis CMS yang baru diterapkan, sebagai berikut:%0D%0A%0D%0A1. Ringkasan Umum%0D%0A   Website telah berhasil dirilis pada tanggal [TGL RILIS] dan saat ini digunakan untuk [TUJUAN UTAMA: mis. publikasi informasi, galeri proyek, karier, dsb.].%0D%0A%0D%0A2. Aspek Positif%0D%0A   • Desain responsif: tampilan konsisten di desktop, tablet, dan ponsel.%0D%0A   • Kecepatan akses: waktu muat halaman berada di bawah 3 detik.%0D%0A   • Kemudahan CMS: editor WYSIWYG intuitif bagi tim non-teknis.%0D%0A   • Integrasi SEO: meta tag otomatis & XML sitemap ter-generate.%0D%0A%0D%0A3. Kendala/Temuan%0D%0A   • Masih terdapat broken link di menu karier (halaman 404).%0D%0A   • Formulir kontak belum terintegrasi dengan CRM internal.%0D%0A   • Fitur pencarian tidak menampilkan hasil relevan untuk kata kunci tertentu.%0D%0A   • Cache CMS terkadang tidak otomatis invalidate setelah update konten.%0D%0A%0D%0A4. Rekomendasi Perbaikan%0D%0A   • Penambahan modul FAQ berbasis CMS agar mudah dikelola tim support.%0D%0A   • Penggunaan lazy-load pada galeri foto untuk optimasi performa.%0D%0A   • Pemberian notifikasi real-time di dashboard CMS saat ada pengajuan karier baru.%0D%0A   • Penambahan field “alt text” otomatis pada gambar untuk aksesibilitas.%0D%0A%0D%0A5. Informasi Teknis Tambahan%0D%0A   • CMS yang digunakan: [NAMA CMS, mis. Strapi v4.15 / WordPress 6.5].%0D%0A   • Hosting: [VPS / Cloud / Shared], lokasi server [SINGAPORE/US].%0D%0A   • Browser/Perangkat utama pengujian: Chrome 125, Safari 17, iOS 17, Android 14.%0D%0A%0D%0ADemikian disampaikan. Atas perhatian dan kerja keras Tim Pengembangan, saya ucapkan terima kasih.%0D%0A%0D%0AHormat saya,%0D%0A%0D%0A[Nama Lengkap]%0D%0A[Jabatan / Bagian Pemilik Proyek]%0D%0A[Email] | [Telepon]";


interface TiktokIconProps {
    className?: string;
}
export const TikTokIcon = ({ className }: TiktokIconProps) => (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.26z" />
    </svg>
)

interface WhatsappIconProps {
    className?: string;
}

export const WhatsappIcon = ({ className }: WhatsappIconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className={cn(className)}>
        <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
        <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
        <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
        <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
        <path fill="#fff" fillRule="evenodd" clipRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"></path>
    </svg>
)

interface XIconProps {
    className?: string;
}
export const XIcon = ({ className }: XIconProps) => (
    <svg className={cn(className)} viewBox="0 0 30 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
    </svg>
)


interface TelegramIconProps {
    className?: string;
}

export const TelegramIcon = ({ className }: TelegramIconProps) => (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0 -.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
)