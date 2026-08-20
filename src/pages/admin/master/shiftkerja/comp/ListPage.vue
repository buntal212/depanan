<template>
  <div class="column fit q-pa-sm">
    <q-list class="rounded-borders full-height column">
      <q-item-label header><div class="row items-center full-width"><div class="col-grow"><app-input v-model="store.params.q" prepend-icon="search" label="Telusuri shift" style="min-width:250px" :debounce="300" @update:model-value="refresh" /></div><app-btn icon="add" class="text-yellow-8" color="grey-10" tooltip="Tambah Data" @click="emits('add')" /></div></q-item-label>
      <q-separator inset="item" />
      <div ref="scrollTarget" class="col full-height scroll">
        <q-infinite-scroll ref="infiniteScroll" :scroll-target="scrollTarget" :offset="150" :disable="store.isError || store.meta?.next_page_url === null" @load="store.loadMore">
          <q-item v-for="item in store.items" :key="item.id" clickable v-ripple @mouseover="hovered = item.id" @mouseleave="hovered = null">
            <q-item-section avatar><q-avatar color="yellow-9" text-color="white">{{ (item.nama || item.kode || 'S')[0] }}</q-avatar></q-item-section>
            <q-item-section><q-item-label>{{ item.kode }} - {{ item.nama }}</q-item-label><q-item-label caption>{{ item.jam_masuk }} - {{ item.jam_keluar }} · Toleransi {{ item.toleransi || 0 }} menit</q-item-label></q-item-section>
            <q-item-section side><div v-if="hovered === item.id" class="flex q-gutter-sm"><app-btn-edit-list @click="emits('edit', item)" /><app-btn-delete-list @click="remove(item)" /></div><q-badge v-else :color="Number(item.aktif) ? 'positive' : 'grey'">{{ Number(item.aktif) ? 'Aktif' : 'Nonaktif' }}</q-badge></q-item-section>
          </q-item><q-separator inset="item" />
          <template #loading><div class="text-center q-my-md"><q-spinner-dots color="yellow-9" size="40px" /></div></template>
        </q-infinite-scroll>
      </div>
    </q-list>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAdminMasterShiftKerjaStore } from 'src/stores/admin/master/shiftkerja/list'
const store = useAdminMasterShiftKerjaStore(); const $q = useQuasar(); const hovered = ref(null); const scrollTarget = ref(null); const infiniteScroll = ref(null); const emits = defineEmits(['add', 'edit'])
onMounted(() => store.getList())
function refresh() { infiniteScroll.value?.reset(); store.getList() }
function remove(item) { $q.dialog({ title: 'Peringatan', message: 'Apakah data ini akan dihapus?', cancel: true }).onOk(() => store.deleteItem(item.id)) }
</script>
