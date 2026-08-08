<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto full-width">
          <div class="row items-center justify-between">
            <div class="f-12 text-weight-bold">Hak Akses</div>
          </div>
        </q-card-section>
        <q-card-section style="max-height: 98%" class="scroll">
          <q-list>
            <transition-group>
              <q-item v-for="(item, n) in store.hakakses" :key="n" class="list-move">
                <q-item-section>
                  <div class="row full-width q-gutter-xs">
                    <div class="col-2">
                      <q-item-label class="text-weight-medium"> Menu </q-item-label>
                    </div>
                    <div class="col-1">
                      <q-item-label class="text-weight-medium"> :</q-item-label>
                    </div>
                    <div class="col-4">
                      <q-item-label class="text-weight-medium"> {{ item?.label }}</q-item-label>
                    </div>
                  </div>
                  <div class="row full-width q-gutter-xs">
                    <div class="col-2">
                      <q-item-label class="text-weight-medium"> Submenu </q-item-label>
                    </div>
                    <div class="col-1">
                      <q-item-label class="text-weight-medium"> :</q-item-label>
                    </div>
                    <div class="col-5">
                      <div class="row" v-for="(submenu, x) in item?.subs" :key="x">
                        <div class="col-5">
                          <q-item-label class="text-weight-medium">
                            {{ submenu?.label }}</q-item-label
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <q-separator class="q-mt-sm" />
                </q-item-section>
                <!-- <q-item-section top side>
                  <div class="q-gutter-sm">
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="person_pin"
                      @click="
                        hapusrincian(
                          item?.id,
                          storeform.form.nopenerimaan,
                          item?.noorder,
                          item?.kdbarang,
                        )
                      "
                    />
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="visibility"
                      @click="
                        hapusrincian(
                          item?.id,
                          storeform.form.nopenerimaan,
                          item?.noorder,
                          item?.kdbarang,
                        )
                      "
                    />
                  </div>
                </q-item-section> -->
              </q-item>
            </transition-group>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>
import { useAdminMasterPegawaiStore } from 'src/stores/admin/master/pegawai/list'

const store = useAdminMasterPegawaiStore()
</script>
