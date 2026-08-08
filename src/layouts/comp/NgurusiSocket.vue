<template>
  <div></div>
</template>

<script setup>
import {onMounted} from 'vue'
import { socket } from 'src/modules/sockets'

import { useAdminOrderPenjualanStore } from 'src/stores/admin/transaksi/orderpenjualan/list'
import { useAppStore } from 'src/stores/app/index'

const storeOrderPenjualan = useAdminOrderPenjualanStore()
const auth = useAppStore()


onMounted(() => {
  // console.log('dari ngurusi socket ...');
  
  joinkeOrderPenjualan(auth.user?.id)

});

function joinkeOrderPenjualan(userId){
  socket.on('connect', () => {
    console.log('[SOCKET] Connected:', socket.id)
    socket.emit('register',userId) // ⬅️ ini harus lihat socket.on di server, jika namanya mboh, maka emit nya mboh ('order-penjualan') ini nama roomnya
    socket.emit('join-room', 'order-penjualan') // ⬅️ ini harus lihat socket.on di server, jika namanya mboh, maka emit nya mboh ('order-penjualan') ini nama roomnya
    console.log('[SOCKET] join emitted ke order-penjualan');
  })

  // ini harus lihat event yang dikirim dari laravel
  socket.on('order-status', (data) => {
    console.log('[EVENT] order-status:', data);
    // baru lanjut mau ngapain saja setelah ngelihat console data 

    const order = storeOrderPenjualan.items?.find(x=>x.id === data?.order?.id)
    if (order) {
      order['status_order'] = data?.order['status_order'] ?? null
    }

    const orderId = storeOrderPenjualan?.item?.id === data?.order?.id
    if (orderId) {
      storeOrderPenjualan.item['status_order'] = data?.order['status_order'] ?? null
    }
    


  });

  socket.on('connect_error', (err) => {
    console.error('[SOCKET] Connection Error:', err)
  })

  socket.on('disconnect', (reason) => {
    console.warn('[SOCKET] Disconnected:', reason)
  })

  // socket.on('reconnect_attempt', () => {
  //   console.log('[SOCKET] Trying to reconnect...')
  // })

}

</script>