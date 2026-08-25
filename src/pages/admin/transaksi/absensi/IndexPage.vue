<template>
  <q-page class="absensi-page q-pa-md">
    <div class="row items-center justify-between q-mb-lg q-col-gutter-md">
      <div class="col-12 col-sm">
        <div class="eyebrow">KEHADIRAN PEGAWAI</div>
        <div class="text-h4 text-weight-bold">Permohonan Tidak Masuk</div>
        <div class="text-body2 text-grey-6 q-mt-xs">
          Catat pegawai yang tidak masuk karena izin, sakit, atau alpha.
        </div>
      </div>
      <div class="col-auto">
        <q-chip icon="event_busy" color="primary" text-color="white">
          {{ store.items.length }} catatan
        </q-chip>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-4">
        <q-card flat bordered class="panel sticky-form">
          <q-card-section class="row items-center">
            <div class="form-icon"><q-icon name="person_off" size="24px" /></div>
            <div class="q-ml-md">
              <div class="text-subtitle1 text-weight-bold">
                {{ store.form.id ? 'Ubah catatan' : 'Form tidak masuk' }}
              </div>
              <div class="text-caption text-grey-6">Semua kolom bertanda * wajib diisi</div>
            </div>
          </q-card-section>
          <q-separator />
          <q-form ref="formRef" @submit="simpan">
            <q-card-section class="q-gutter-md">
              <q-select
                v-model="store.form.user_id"
                :options="opsiPegawai"
                label="Pegawai *"
                outlined
                emit-value
                map-options
                use-input
                input-debounce="0"
                :rules="[(value) => !!value || 'Pegawai wajib dipilih']"
                @filter="filterPegawai"
              >
                <template #prepend><q-icon name="badge" /></template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.jabatan || 'Pegawai' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <div>
                <div class="field-label">Alasan tidak masuk *</div>
                <q-btn-toggle
                  v-model="store.form.jenis"
                  spread
                  no-caps
                  unelevated
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="jenisOptions"
                />
              </div>

              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-input v-model="store.form.tanggal_mulai" label="Mulai *" outlined readonly :rules="aturanTanggal">
                    <template #prepend><q-icon name="event" /></template>
                    <template #append>
                      <q-icon name="arrow_drop_down" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="store.form.tanggal_mulai" mask="YYYY-MM-DD" color="primary" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="store.form.tanggal_selesai" label="Selesai *" outlined readonly :rules="aturanTanggalSelesai">
                    <template #prepend><q-icon name="event_available" /></template>
                    <template #append>
                      <q-icon name="arrow_drop_down" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="store.form.tanggal_selesai" mask="YYYY-MM-DD" color="primary" :options="tanggalSelesaiValid" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>

              <q-input
                v-model="store.form.keterangan"
                label="Keterangan *"
                type="textarea"
                autogrow
                outlined
                counter
                maxlength="500"
                :rules="[(value) => !!value?.trim() || 'Keterangan wajib diisi']"
              >
                <template #prepend><q-icon name="notes" /></template>
              </q-input>
            </q-card-section>
            <q-card-actions class="q-px-md q-pb-md">
              <q-btn v-if="store.form.id" flat no-caps label="Batal" color="grey-7" @click="store.resetForm()" />
              <q-space />
              <q-btn
                type="submit"
                no-caps
                unelevated
                color="primary"
                icon="save"
                :label="store.form.id ? 'Simpan perubahan' : 'Simpan permohonan'"
                :loading="store.saving"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>

      <div class="col-12 col-lg-8">
        <q-card flat bordered class="panel">
          <q-card-section class="row items-center q-col-gutter-sm">
            <div class="col-12 col-sm">
              <div class="text-subtitle1 text-weight-bold">Riwayat ketidakhadiran</div>
              <div class="text-caption text-grey-6">Catatan terbaru ditampilkan paling atas</div>
            </div>
            <div class="col-12 col-sm-4">
              <q-input v-model="store.filter.q" dense outlined clearable debounce="400" placeholder="Cari pegawai..." @update:model-value="store.getData()">
                <template #prepend><q-icon name="search" /></template>
              </q-input>
            </div>
            <div class="col-12 col-sm-3">
              <q-select v-model="store.filter.jenis" :options="filterJenis" dense outlined clearable emit-value map-options label="Semua alasan" @update:model-value="store.getData()" />
            </div>
          </q-card-section>
          <q-separator />
          <q-table
            :rows="store.items"
            :columns="columns"
            row-key="id"
            flat
            wrap-cells
            :loading="store.loading"
            :pagination="{ rowsPerPage: 10 }"
            no-data-label="Belum ada catatan ketidakhadiran"
          >
            <template #body-cell-pegawai="props">
              <q-td :props="props">
                <div class="text-weight-bold">{{ props.row.pegawai?.nama || props.row.pegawai?.username || '-' }}</div>
                <div class="text-caption text-grey-6">{{ props.row.pegawai?.jabatan || 'Pegawai' }}</div>
              </q-td>
            </template>
            <template #body-cell-jenis="props">
              <q-td :props="props"><q-badge rounded :color="warnaJenis(props.value)" class="q-px-sm q-py-xs">{{ labelJenis(props.value) }}</q-badge></q-td>
            </template>
            <template #body-cell-periode="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ formatTanggal(props.row.tanggal_mulai) }}</div>
                <div v-if="props.row.tanggal_mulai !== props.row.tanggal_selesai" class="text-caption text-grey-6">s.d. {{ formatTanggal(props.row.tanggal_selesai) }}</div>
                <div class="text-caption text-primary">{{ props.row.jumlah_hari }} hari</div>
              </q-td>
            </template>
            <template #body-cell-aksi="props">
              <q-td :props="props" class="no-wrap">
                <q-btn round flat dense color="primary" icon="edit" aria-label="Ubah" @click="store.edit(props.row)"><q-tooltip>Ubah catatan</q-tooltip></q-btn>
                <q-btn round flat dense color="negative" icon="delete_outline" aria-label="Hapus" :loading="store.deletingId === props.row.id" @click="konfirmasiHapus(props.row)"><q-tooltip>Hapus catatan</q-tooltip></q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { date, useQuasar } from 'quasar'
import { useTransaksiAbsensiStore } from 'src/stores/admin/transaksi/absensi'

const store = useTransaksiAbsensiStore()
const $q = useQuasar()
const formRef = ref(null)
const opsiPegawai = ref([])
const jenisOptions = [
  { label: 'Izin', value: 'izin' },
  { label: 'Sakit', value: 'sakit' },
  { label: 'Alpha', value: 'alpha' },
]
const filterJenis = jenisOptions.map((item) => ({ ...item }))
const columns = [
  { name: 'pegawai', label: 'PEGAWAI', field: 'pegawai', align: 'left' },
  { name: 'jenis', label: 'ALASAN', field: 'jenis', align: 'center' },
  { name: 'periode', label: 'PERIODE', field: 'tanggal_mulai', align: 'left' },
  { name: 'keterangan', label: 'KETERANGAN', field: 'keterangan', align: 'left' },
  { name: 'aksi', label: 'AKSI', align: 'center' },
]
const aturanTanggal = [(value) => !!value || 'Tanggal mulai wajib diisi']
const aturanTanggalSelesai = [
  (value) => !!value || 'Tanggal selesai wajib diisi',
  (value) => value >= store.form.tanggal_mulai || 'Tanggal selesai tidak boleh sebelum tanggal mulai',
]
const tanggalSelesaiValid = (value) => value >= store.form.tanggal_mulai.replaceAll('-', '/')
const formatTanggal = (value) => date.formatDate(value, 'DD MMM YYYY')
const labelJenis = (value) => ({ izin: 'Izin', sakit: 'Sakit', alpha: 'Alpha' })[value] || value
const warnaJenis = (value) => ({ izin: 'info', sakit: 'orange', alpha: 'negative' })[value] || 'grey'
const filterPegawai = (value, update) => update(() => {
  const needle = String(value || '').toLowerCase()
  opsiPegawai.value = store.pegawai.filter((item) => item.label.toLowerCase().includes(needle))
})
const simpan = async () => {
  const berhasil = await store.simpan()
  if (berhasil) formRef.value?.resetValidation()
}
const konfirmasiHapus = (item) => {
  $q.dialog({
    title: 'Hapus catatan?',
    message: `Catatan ${labelJenis(item.jenis)} untuk ${item.pegawai?.nama || item.pegawai?.username} akan dihapus.`,
    cancel: { label: 'Batal', flat: true, noCaps: true },
    ok: { label: 'Hapus', color: 'negative', unelevated: true, noCaps: true },
  }).onOk(() => store.hapus(item.id))
}

onMounted(async () => {
  await Promise.all([store.getPegawai(), store.getData()])
  opsiPegawai.value = store.pegawai
})
</script>

<style scoped>
.absensi-page { margin: auto; max-width: 1600px; }
.eyebrow { color: var(--q-primary); font-size: 11px; font-weight: 800; letter-spacing: 1.5px; }
.panel { border-radius: 16px; overflow: hidden; }
.form-icon { align-items: center; background: rgba(99, 74, 234, .12); border-radius: 12px; color: var(--q-primary); display: flex; height: 48px; justify-content: center; width: 48px; }
.field-label { color: #666; font-size: 12px; font-weight: 700; margin-bottom: 7px; }
.sticky-form { position: sticky; top: 16px; }
:deep(.q-table thead tr) { background: rgba(99, 74, 234, .07); }
:deep(.q-table th) { color: #666; font-size: 11px; font-weight: 800; letter-spacing: .5px; }
@media (max-width: 1023px) { .sticky-form { position: static; } }
@media (max-width: 599px) { .absensi-page { padding: 12px; } .text-h4 { font-size: 25px; line-height: 1.2; } }
</style>
