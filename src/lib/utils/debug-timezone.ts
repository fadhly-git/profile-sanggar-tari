/* eslint-disable @typescript-eslint/no-explicit-any */
// @/lib/utils/debug-timezone.ts

/**
 * Debug utility untuk membantu troubleshoot masalah timezone
 */

export function debugTimezone(label: string, dateInput: any) {
    console.group(`🕐 Debug Timezone: ${label}`)

    console.log('Original Input:', dateInput)
    console.log('Input Type:', typeof dateInput)

    if (dateInput) {
        const date = new Date(dateInput)

        console.log('Date Object:', date)
        console.log('ISO String:', date.toISOString())
        console.log('Local String:', date.toString())
        console.log('Indonesia Time:', date.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }))
        console.log('UTC Time:', date.toUTCString())
        console.log('Timezone Offset (minutes):', date.getTimezoneOffset())

        // Compare with Indonesia timezone
        const indonesiaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
        console.log('Indonesia Date Object:', indonesiaDate)
        console.log('Difference (hours):', (date.getTime() - indonesiaDate.getTime()) / (1000 * 60 * 60))
    }

    console.groupEnd()
}

export function debugFormData(formData: any) {
    console.group('📝 Debug Form Data')

    Object.entries(formData).forEach(([key, value]) => {
        if (key.includes('Date') && value) {
            debugTimezone(`Form ${key}`, value)
        } else {
            console.log(`${key}:`, value)
        }
    })

    console.groupEnd()
}
