<template>
  <q-card flat bordered class="recent-card full-height">
    <q-card-section class="row items-center justify-between no-wrap">
      <div>
        <div class="text-h6 text-weight-bold">{{ title }}</div>
        <div class="text-caption text-grey-6">{{ subtitle }}</div>
      </div>
      <q-btn flat round color="primary" icon="arrow_forward" :to="to">
        <q-tooltip>Lihat semua</q-tooltip>
      </q-btn>
    </q-card-section>
    <q-separator dark />
    <q-list dark separator>
      <template v-if="loading">
        <q-item v-for="row in 5" :key="row">
          <q-item-section><q-skeleton type="text" dark /></q-item-section>
        </q-item>
      </template>
      <q-item v-else-if="!items.length">
        <q-item-section class="text-center text-grey-6 q-py-md">Belum ada data.</q-item-section>
      </q-item>
      <template v-else>
        <q-item v-for="item in items" :key="item.nomor">
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ item.nomor }}</q-item-label>
            <q-item-label caption>{{ item.pihak }} · {{ formatDate(item.tanggal) }}</q-item-label>
          </q-item-section>
          <q-item-section side class="items-end">
            <q-item-label class="text-white text-weight-medium">{{ formatCurrency(item.total) }}</q-item-label>
            <q-item-label caption>{{ item.keterangan }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-card>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  to: { type: String, required: true },
  items: { type: Array, default: () => [] },
  loading: Boolean,
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value))

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(value))
    : '-'
</script>

<style scoped>
.recent-card {
  color: #f8fafc;
  background: #111111;
  border-radius: 16px;
  border-color: rgba(148, 163, 184, 0.15);
}
</style>
