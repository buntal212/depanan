<template>
  <div class="fit">
    <q-splitter
      v-model="splitterModel"
      separator-style="width: 1px"
      :limits="[25, 60]"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
      class="fit "
    >
      <template #before>
        <div class="column fit q-pa-md">
          <q-card flat bordered>
            <q-card-section class="flex q-gutter-x-md q-pa-sm">
              <q-avatar size="3.5em">
                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
              </q-avatar>
              <div class="column">
                <div class="text-h6">John Doe</div>
                <div class="text-subtitle2">Admin</div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-mt-md">
            <q-list bordered separator >
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Profile</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Profile</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <q-card flat bordered class="absolute-bottom q-mb-lg q-ma-md">
            <q-list bordered separator >
              <q-item clickable v-ripple class="text-negative" @click="logout">
                <q-item-section avatar>
                  <q-icon :name="tabLogout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>

      <template #after>
        <div class="column fit q-pa-md">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque neque nobis obcaecati, totam quia odio accusantium sequi ipsam et tempore quis praesentium dignissimos, minus earum? Voluptatum consectetur dolorem est exercitationem?
          </div>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { tabLogout } from 'quasar-extras-svg-icons/tabler-icons-v2'
import { useAppStore } from 'src/stores/app';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const splitterModel = ref(35)
const router = useRouter()
const app = useAppStore()

const logout = () => {
  // console.log('logout')
  app.logout()
  .then(() => {
    router.push('/auth')
  })
  
}
</script>