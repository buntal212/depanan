<template>
  <q-page class="dashboard-page q-pa-md q-pa-lg-lg">
    <section class="dashboard-hero q-pa-lg q-mb-lg">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-md-auto">
          <div class="text-overline text-primary text-weight-bold">RINGKASAN TOKO</div>
          <h1 class="text-h4 text-weight-bold q-my-xs">Selamat datang kembali</h1>
          <div class="text-grey-6">Pantau aktivitas dan performa toko hari ini.</div>
        </div>
        <div class="col-12 col-md-auto row items-center q-gutter-sm">
          <q-chip color="primary" text-color="white" icon="calendar_month">
            {{ todayLabel }}
          </q-chip>
          <q-btn
            color="primary"
            unelevated
            icon="refresh"
            label="Muat ulang"
            :loading="store.loading"
            @click="loadDashboard"
          />
        </div>
      </div>
    </section>

    <q-banner v-if="store.error" rounded class="bg-orange-1 text-orange-10 q-mb-lg">
      <template #avatar><q-icon name="info" color="orange" /></template>
      {{ store.error }}
      <template #action>
        <q-btn flat color="orange-10" label="Coba lagi" @click="loadDashboard" />
      </template>
    </q-banner>

    <section class="row q-col-gutter-md q-mb-lg">
      <div v-for="item in summaryCards" :key="item.label" class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card full-height">
          <q-card-section class="row items-center no-wrap q-pa-lg">
            <div class="summary-icon" :style="{ background: item.background, color: item.color }">
              <q-icon :name="item.icon" size="28px" />
            </div>
            <div class="q-ml-md ellipsis">
              <div class="text-caption text-grey-6 text-uppercase">{{ item.label }}</div>
              <q-skeleton v-if="store.loading" type="text" width="110px" height="30px" />
              <div v-else class="text-h5 text-weight-bold ellipsis">{{ item.value }}</div>
              <div class="text-caption text-grey-6">{{ item.caption }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <section class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-xl-6">
        <q-card flat bordered class="panel-card">
          <q-card-section>
            <q-skeleton v-if="store.loading" height="350px" square />
            <e-chart
              v-else
              dark
              title="Penjualan Bulanan"
              :xAxisData="store.salesData.months"
              :series="store.salesData.series"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-xl-6">
        <q-card flat bordered class="panel-card">
          <q-card-section>
            <q-skeleton v-if="store.loading" height="350px" square />
            <e-chart
              v-else
              dark
              title="10 Produk Terlaris"
              :xAxisData="store.topProductsData.products"
              :series="store.topProductsData.series"
              horizontal
            />
          </q-card-section>
        </q-card>
      </div>
    </section>

    <section class="row q-col-gutter-lg">
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="panel-card">
          <q-card-section>
            <q-skeleton v-if="store.loading" height="350px" square />
            <e-chart
              v-else
              dark
              title="Status Transaksi"
              :series="store.salesDistributionData.series"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="panel-card">
          <q-card-section>
            <q-skeleton v-if="store.loading" height="350px" square />
            <e-chart
              v-else
              dark
              title="Tren Penjualan Tahun Ini"
              :xAxisData="store.salesTrendData.trendMonths"
              :series="store.salesTrendData.trendSeries"
            />
          </q-card-section>
        </q-card>
      </div>
    </section>

    <section class="row q-col-gutter-lg q-mt-sm">
      <div v-for="list in recentLists" :key="list.title" class="col-12 col-lg-6">
        <recent-list
          :title="list.title"
          :subtitle="list.subtitle"
          :to="list.to"
          :items="list.items"
          :loading="store.loading"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import EChart from 'src/components/charts/EChart.vue'
import RecentList from './RecentList.vue'
import { useAdminDashboardStore } from 'src/stores/admin/dashboard'

const store = useAdminDashboardStore()

const numberFormatter = new Intl.NumberFormat('id-ID')
const todayLabel = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date())

const summaryCards = computed(() => [
  {
    label: 'Total pendapatan',
    value: store.formattedTotalPendapatan,
    caption: 'Akumulasi periode aktif',
    icon: 'payments',
    color: '#2563eb',
    background: '#dbeafe',
  },
  {
    label: 'Transaksi',
    value: numberFormatter.format(store.summaryStats.totalPenjualan),
    caption: 'Penjualan tercatat',
    icon: 'receipt_long',
    color: '#059669',
    background: '#d1fae5',
  },
  {
    label: 'Produk',
    value: numberFormatter.format(store.summaryStats.totalProduk),
    caption: 'Produk dalam katalog',
    icon: 'inventory_2',
    color: '#d97706',
    background: '#fef3c7',
  },
  {
    label: 'Pelanggan',
    value: numberFormatter.format(store.summaryStats.totalPelanggan),
    caption: 'Pelanggan terdaftar',
    icon: 'groups',
    color: '#7c3aed',
    background: '#ede9fe',
  },
])

const loadDashboard = () => store.fetchDashboardData()

const recentLists = computed(() => [
  {
    title: '5 Penjualan Terakhir',
    subtitle: 'Transaksi penjualan terbaru',
    to: '/admin/transaksi/penjualan',
    items: store.recentSales,
  },
  {
    title: '5 Pembelian Terakhir',
    subtitle: 'Penerimaan faktur terbaru',
    to: '/admin/transaksi/penerimaan',
    items: store.recentPurchases,
  },
  {
    title: '5 Pembayaran Hutang Terakhir',
    subtitle: 'Pembayaran kepada supplier',
    to: '/admin/transaksi/pembayaran-hutang',
    items: store.recentDebtPayments,
  },
  {
    title: '5 Pembayaran Piutang Terakhir',
    subtitle: 'Pembayaran dari pelanggan',
    to: '/admin/transaksi/pembayaran-piutang',
    items: store.recentReceivablePayments,
  },
])

onMounted(loadDashboard)
</script>

<style scoped>
.dashboard-page {
  color: #f8fafc;
  background: #050505;
  min-height: 100%;
}

.dashboard-hero {
  background: linear-gradient(135deg, #111827, #09090b);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 20px;
}

.summary-card,
.panel-card {
  color: #f8fafc;
  background: #111111;
  border-radius: 16px;
  border-color: rgba(148, 163, 184, 0.15);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(10px);
}

.summary-card {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.09);
}

.summary-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.panel-card {
  min-height: 100%;
}

:global(.body--dark) .dashboard-page {
  background: #050505;
}

:global(.body--dark) .dashboard-hero {
  background: linear-gradient(135deg, #111827, #09090b);
  border-color: rgba(148, 163, 184, 0.16);
}

:global(.body--dark) .summary-card,
:global(.body--dark) .panel-card {
  background: #111111;
  border-color: rgba(148, 163, 184, 0.13);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
}

@media (max-width: 599px) {
  .dashboard-hero {
    border-radius: 14px;
  }
}
</style>
