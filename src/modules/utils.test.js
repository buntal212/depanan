import { describe, expect, it } from 'vitest'
import { formatRp, timeDiff, titleCase } from './utils'

describe('utilitas tampilan', () => {
  it('memformat angka dengan pemisah ribuan Indonesia', () => {
    expect(formatRp(1250000)).toBe('1.250.000')
  })

  it('menghitung selisih waktu yang melewati tengah malam', () => {
    expect(timeDiff('23:30', '01:00')).toBe('01:30')
  })

  it('mengubah teks menjadi title case', () => {
    expect(titleCase('TOKO BANGUNAN JANGUR')).toBe('Toko Bangunan Jangur')
  })
})
