<template>
  <div class="page-login column full-height flex-center">
    <div class="blob"></div>
    <div class="wrapper relative-position">
      <q-form @submit="onSubmit">
        <div class="column flex-center">
          <avatar-logo size="xl" />
          <div class="text-h5 text-center q-mt-md">LOGIN</div>
        </div>
        <div class="input-box q-my-md">
          <q-input
            v-model="form.username"
            label="Username"
            :rules="[(val) => !!val || 'Username is required']"
          >
            <template v-slot:prepend>
              <q-icon :name="heroOutline24User" />
            </template>
          </q-input>
          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            :rules="[(val) => !!val || 'Password is required']"
          >
            <template v-slot:prepend>
              <q-icon :name="heroOutline24Key" />
            </template>
          </q-input>
        </div>
        <!-- <div class="remember-forgot flex items-center q-gutter-sm">
          <q-checkbox label="Remember Me"></q-checkbox>
          <a href="#">Forgot Password?</a>
        </div> -->
        <q-btn
          :loading="app.loading"
          unelevated
          rounded
          type="submit"
          label="Login"
          color="primary"
          class="full-width q-mt-lg"
        ></q-btn>
        <div class="column flex-center q-mt-md">
          <div>Belum Punya Akun?</div>
          <div>Harap Hubungi Bagian Personalia</div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
// import { useQuasar } from 'quasar'
import { heroOutline24User, heroOutline24Key } from 'quasar-extras-svg-icons/hero-icons-v2'
// import { api } from 'src/boot/axios'
import { useAppStore } from 'src/stores/app'
import { defineAsyncComponent, ref } from 'vue'
// import { useRouter } from 'vue-router'

const AvatarLogo = defineAsyncComponent(() => import('src/components/app/AvatarLogo.vue'))

const app = useAppStore()
// const router = useRouter()
// const $q = useQuasar()
const form = ref({
  username: '',
  password: '',
})

function onSubmit() {
  const formData = new FormData()
  formData.append('username', form.value.username)
  formData.append('password', form.value.password)
  app.login(formData)
}
// const onSubmit = async () => {
//   try {
//     loading.value = true
//     const { data } = await api.post('/login', form.value)

//     // Set token for future requests
//     api.defaults.headers.common.Authorization = `Bearer ${data.token}`

//     // Update auth state
//     await app.login()

//     $q.notify({
//       type: 'positive',
//       message: 'Login successful',
//     })

//     router.push('/')
//   } catch (error) {
//     $q.notify({
//       type: 'negative',
//       message: error.response?.data?.message || 'Login failed',
//     })
//   } finally {
//     loading.value = false
//   }
// }
</script>

<style lang="scss" scoped>
.wrapper {
  width: 350px;
  height: 450px;
  background-color: rgba($secondary, 0.15);
  box-shadow: 0 8px 32px $info;
  border: 1px solid $grey-3;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* when div1 is hovered make div2 blue */
// body:has(#div1:hover) #div2 {
//   background: blue;
// }

.page-login:has(.wrapper:hover) .blob {
  width: 540px;
  height: 540px;
  filter: blur(40px);
  box-shadow:
        // inset 0 0 5px rgba($grey-4, .6),
    inset 100px 0 0 $secondary,
    inset 200px 0 0 $warning,
    inset 300px 0 0 $warning;
}

.blob {
  position: absolute;
  width: 500px;
  height: 500px;
  background: linear-gradient(45deg, $secondary, $primary);
  z-index: 0;
  border-radius: 27% 73% 33% 67% / 27% 35% 65% 73%;
  transform: translate(-100px, -50px) rotate(-90deg);
  transition: 0.5s cubic-bezier(0.7, 0.8, 0.16, 1);
  animation: animateBlob 10s infinite alternate;
}

.blob:hover {
  width: 540px;
  height: 540px;
  filter: blur(40px);
  box-shadow:
        // inset 0 0 5px rgba($grey-4, .6),
    inset 100px 0 0 $secondary,
    inset 200px 0 0 $warning,
    inset 300px 0 0 $warning;
}

@keyframes animateBlob {
  100% {
    transform: translate(300px, 50px) rotate(-10deg);
    border-radius: 60% 40% 52% 48% / 55% 32% 68% 45%;
  }
}
</style>
