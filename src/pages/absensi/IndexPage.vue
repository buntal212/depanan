<template>
  <div class="fit column justify-center items-center">
    <div class="text-h5">Absensi</div>
    <div>
      <q-card>
        <q-card-section>
          <div class="row justify-center">
            <div class="col-auto"><qrcode-vue :value="qrValue" :size="200" level="H" /></div>
            <q-separator class="q-mx-md" vertical />
            <div class="col-auto">
              <div class="text-h6">Scan QR Code</div>
              <div class="text-subtitle2">Untuk Absen</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>
//import QRCode from 'qrcode.vue'
import QrcodeVue from 'qrcode.vue'
import { SERV } from 'src/boot/axios'
import { onBeforeUnmount, onMounted, ref } from 'vue'
const qrValue = ref('loading...')
let timer = null

// Fungsi ambil data dari API (misalnya backend kasih token absensi)
async function getQrFromApi() {
  try {
    // const resp = await fetch('http://localhost:3000/qr') // ganti sesuai API kamu
    // const data = await resp.json()
    // qrCodeValue.value = data.token // asumsinya API balikin { token: "xxx" }
    qrValue.value = `${SERV}/api/v1/absensi/absen`
  } catch (err) {
    console.error('Gagal fetch QR:', err)
  }
}

onMounted(() => {
  getQrFromApi()
  // refresh otomatis tiap 10 detik
  timer = setInterval(getQrFromApi, 10000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
