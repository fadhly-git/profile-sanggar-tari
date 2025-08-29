// @/lib/utils/timezone.ts

/**
 * Utility functions untuk menangani timezone dengan benar
 * Indonesia menggunakan WIB (UTC+7)
 */

const INDONESIA_TIMEZONE = 'Asia/Jakarta'

/**
 * Konversi string datetime-local ke Date object dengan timezone Indonesia
 * Input: "2025-08-29T08:00" (dari datetime-local input)
 * Output: Date object yang merepresentasikan waktu Indonesia yang benar
 */
export function parseLocalDateTime(datetimeString: string): Date {
  if (!datetimeString) return new Date()
  
  // Tambahkan timezone offset untuk Indonesia (+07:00)
  // Ini memastikan bahwa waktu disimpan dengan benar sebagai waktu Indonesia
  const dateWithTimezone = `${datetimeString}+07:00`
  return new Date(dateWithTimezone)
}

/**
 * Konversi Date object ke format string untuk datetime-local input
 * Memastikan waktu ditampilkan dalam timezone Indonesia
 */
export function formatToLocalDateTime(date: Date): string {
  if (!date) return ''
  
  // Konversi ke timezone Indonesia
  const indonesiaDate = new Date(date.toLocaleString('en-US', { timeZone: INDONESIA_TIMEZONE }))
  
  // Format ke YYYY-MM-DDTHH:mm untuk datetime-local input
  const year = indonesiaDate.getFullYear()
  const month = String(indonesiaDate.getMonth() + 1).padStart(2, '0')
  const day = String(indonesiaDate.getDate()).padStart(2, '0')
  const hours = String(indonesiaDate.getHours()).padStart(2, '0')
  const minutes = String(indonesiaDate.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Mendapatkan waktu saat ini dalam timezone Indonesia
 */
export function getCurrentIndonesiaTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: INDONESIA_TIMEZONE }))
}

/**
 * Konversi Date ke waktu Indonesia untuk display
 */
export function toIndonesiaTime(date: Date): Date {
  if (!date) return new Date()
  return new Date(date.toLocaleString('en-US', { timeZone: INDONESIA_TIMEZONE }))
}

/**
 * Format waktu untuk display di Indonesia (HH:mm)
 */
export function formatIndonesiaTime(date: Date): string {
  if (!date) return ''
  
  return date.toLocaleString('id-ID', {
    timeZone: INDONESIA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/**
 * Format tanggal dan waktu lengkap untuk Indonesia
 */
export function formatIndonesiaDateTime(date: Date): string {
  if (!date) return ''
  
  return date.toLocaleString('id-ID', {
    timeZone: INDONESIA_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
