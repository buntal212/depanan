<template>
  <div>
    <div class="row q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">History Pengembalian Barang</div>
            <q-space />
            <q-btn
              label="Kembali"
              color="primary"
              @click="$emit('back')"
              icon="arrow_back"
            />
          </q-card-section>

          <q-card-section>
            <q-table
              :rows="list.items"
              :columns="columns"
              :loading="list.loading"
              row-key="id"
              v-model:pagination="pagination"
              @request="onRequest"
              binary-state-sort
            >
              <!-- Status Column -->
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="getStatusColor(props.value)"
                    text-color="white"
                    :label="props.value"
                  />
                </q-td>
              </template>
              <!-- Tanggal Column -->
              <template #body-cell-tanggal="props">
                <q-td :props="props">
                  <div>{{ dateFull(props.value) }}</div>
                </q-td>
              </template>

              <!-- Actions Column -->
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="info"
                    icon="visibility"
                    @click="showDetail(props.row)"
                  >
                    <q-tooltip>Lihat Detail</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Detail -->
    <q-dialog v-model="showDetailDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Detail Pengembalian</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedItem">
          <div class="q-gutter-sm">
            <div class="row">
              <div class="col-4">No Pengembalian</div>
              <div class="col-8">: {{ selectedItem.no_pengembalian }}</div>
            </div>
            <div class="row">
              <div class="col-4">No Penjualan</div>
              <div class="col-8">: {{ selectedItem.penjualan?.no_penjualan }}</div>
            </div>
            <div class="row">
              <div class="col-4">Tanggal</div>
              <div class="col-8">: {{ dateFull(selectedItem.tanggal) }}</div>
            </div>
            <div class="row">
              <div class="col-4">Status</div>
              <div class="col-8">
                <q-chip
                  :color="getStatusColor(selectedItem.status)"
                  text-color="white"
                  :label="selectedItem.status"
                />
              </div>
            </div>

            <!-- Detail Items -->
            <q-table
              :rows="selectedItem.details"
              :columns="detailColumns"
              row-key="id"
              flat
              dense
              hide-pagination
              :pagination="{ rowsPerPage: 0 }"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-mt-md">
          <!-- Tombol approve/reject hanya muncul jika status pending -->
          <template v-if="selectedItem?.status === 'pending'">
            <q-btn
              label="Tolak"
              no-caps
              dense
              color="negative"
              :loading="form.loading"
              @click="confirmReject"
            />
            <q-btn
              label="Setujui"
              color="green"
              no-caps
              dense
              :loading="form.loading"
              @click="confirmApprove"
            />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Konfirmasi -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="text-subtitle1">{{ confirmMessage }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Batal" color="primary" v-close-popup />
          <q-btn
            :label="confirmAction === 'approve' ? 'Setujui' : 'Tolak'"
            :color="confirmAction === 'approve' ? 'positive' : 'negative'"
            @click="handleConfirm"
            :loading="form.loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useListPengembalianStore } from 'src/stores/admin/transaksi/pengembalianBarang/list'
import { useFormPengembalianStore } from 'src/stores/admin/transaksi/pengembalianBarang/form'
import { dateFull } from 'src/modules/formatter'

// Store
const list = useListPengembalianStore()
const form = useFormPengembalianStore()

// State
const showDetailDialog = ref(false)
const showConfirmDialog = ref(false)
const selectedItem = ref(null)
const confirmAction = ref('')
const confirmMessage = ref('')

// Table config
const pagination = ref({
  sortBy: 'tanggal',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

const columns = [
  {
    name: 'no_pengembalian',
    label: 'No Pengembalian',
    field: 'no_pengembalian',
    align: 'left',
    sortable: true
  },
  {
    name: 'tanggal',
    label: 'Tanggal',
    field: 'tanggal',
    align: 'left',
    sortable: true
  },
  {
    name: 'no_penjualan',
    label: 'No Penjualan',
    field: row => row.no_penjualan,
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  }
]

const detailColumns = [
  {
    name: 'barang',
    label: 'Barang',
    field: row => row.barang?.namabarang,
    align: 'left'
  },
  {
    name: 'motif',
    label: 'Seri',
    field: 'motif',
    align: 'left'
  },
  {
    name: 'qty',
    label: 'Qty',
    field: 'qty',
    align: 'right'
  },
  {
    name: 'keterangan',
    label: 'Keterangan',
    field: 'keterangan_rusak',
    align: 'left'
  }
]

// Methods
function getStatusColor(status) {
  const colors = {
    pending: 'warning',
    diganti: 'positive',
    ditolak: 'negative'
  }
  return colors[status] || 'grey'
}

function showDetail(item) {
  selectedItem.value = item
  showDetailDialog.value = true
}

function confirmApprove() {
  confirmAction.value = 'approve'
  confirmMessage.value = `Apakah anda yakin ingin menyetujui pengembalian barang ${selectedItem.value.no_pengembalian}?`
  showConfirmDialog.value = true
}

function confirmReject() {
  confirmAction.value = 'reject'
  confirmMessage.value = `Apakah anda yakin ingin menolak pengembalian barang ${selectedItem.value.no_pengembalian}?`
  showConfirmDialog.value = true
}

async function handleConfirm() {
  try {
    if (confirmAction.value === 'approve') {
      await form.approve(selectedItem.value.id)
    } else {
      await form.reject(selectedItem.value.id)
    }
    showConfirmDialog.value = false
    showDetailDialog.value = false
  } catch (error) {
    console.error('Error:', error)
  }
}

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  list.params.page = page
  list.params.perPage = rowsPerPage
  list.params.sortBy = sortBy
  list.params.sortDesc = descending
  await list.getList()
  pagination.value.rowsNumber = list.total
}

// Initial load
onRequest({ pagination: pagination.value })
</script>
