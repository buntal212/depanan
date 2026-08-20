<template>
  <div class="page-login column full-height flex-center">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>
    <div class="wrapper relative-position">
      <div class="brand-mark"><avatar-logo size="56px" /></div>
      <q-form @submit="onSubmit">
        <div class="welcome-text">
          <div class="eyebrow">SELAMAT DATANG KEMBALI</div>
          <div class="text-h4 text-weight-bold">Masuk ke akunmu</div>
          <div class="subtitle">Kelola aktivitas toko dengan lebih mudah.</div>
        </div>
        <div class="input-box q-my-lg">
          <q-input v-model="form.username" label="Username" outlined dense class="login-input" :rules="[(val) => !!val || 'Username is required']">
            <template v-slot:prepend><q-icon :name="heroOutline24User" /></template>
          </q-input>
          <q-input v-model="form.password" label="Password" type="password" outlined dense class="login-input q-mt-sm" :rules="[(val) => !!val || 'Password is required']">
            <template v-slot:prepend><q-icon :name="heroOutline24Key" /></template>
          </q-input>
        </div>
        <q-btn :loading="app.loading" unelevated rounded type="submit" label="Masuk" color="primary" class="full-width login-button q-mt-md"></q-btn>
        <div class="help-text column flex-center q-mt-lg">
          <div>Belum punya akun?</div>
          <div class="text-weight-medium">Hubungi bagian personalia</div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { heroOutline24User, heroOutline24Key } from 'quasar-extras-svg-icons/hero-icons-v2'
import { useAppStore } from 'src/stores/app'
import { defineAsyncComponent, ref } from 'vue'

const AvatarLogo = defineAsyncComponent(() => import('src/components/app/AvatarLogo.vue'))
const app = useAppStore()
const form = ref({ username: '', password: '' })

function onSubmit() {
  app.login({
    username: form.value.username,
    password: form.value.password,
  })
}
</script>

<style lang="scss" scoped>
.page-login { overflow: hidden; background: radial-gradient(circle at 50% -10%, rgba($primary, 0.2), transparent 36%), #050609; }
.wrapper { width: min(430px, calc(100vw - 32px)); padding: 32px 40px 36px; background: #111318; color: #fff; box-shadow: 0 0 0 1px rgba($primary, 0.12), 0 26px 70px rgba(0, 0, 0, 0.72); border: 1px solid rgba(255, 255, 255, 0.28); border-radius: 28px; z-index: 1; backdrop-filter: blur(18px); }
.brand-mark { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; border-radius: 22px; background: $primary; box-shadow: 0 12px 24px rgba($primary, 0.28); overflow: hidden; }
.brand-mark :deep(.q-avatar) { flex: 0 0 auto; }
.welcome-text { color: #fff; text-align: center; }
.eyebrow { color: $primary; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; }
.subtitle, .help-text { color: rgba(255, 255, 255, 0.72); font-size: 0.85rem; }
.input-box { display: grid; gap: 12px; }
.input-box .q-mt-sm { margin-top: 0 !important; }
.login-input :deep(.q-field__control) { border-radius: 13px; }
.login-input :deep(.q-field__control) { background: #1a1c23; }
.login-input :deep(.q-field__native), .login-input :deep(.q-field__label), .login-input :deep(.q-icon) { color: rgba(255, 255, 255, 0.82); }
.login-input :deep(.q-field__control:before) { border-color: rgba(255, 255, 255, 0.38); }
.login-button { min-height: 48px; font-weight: 700; letter-spacing: 0.02em; box-shadow: 0 10px 20px rgba($primary, 0.22); }
.ambient { position: absolute; border-radius: 50%; filter: blur(2px); opacity: 0.7; }
.ambient-one { width: 420px; height: 420px; background: rgba($primary, 0.22); transform: translate(-260px, -180px); }
.ambient-two { width: 300px; height: 300px; background: rgba($secondary, 0.2); transform: translate(280px, 180px); }
@media (max-width: 480px) { .wrapper { padding: 34px 24px 28px; } }
:global(body.body--dark) .page-login { background: radial-gradient(circle at 50% -10%, rgba($primary, 0.2), transparent 36%), #050609; }
:global(body.body--dark) .wrapper { background: #111318; border-color: rgba(255, 255, 255, 0.28); box-shadow: 0 0 0 1px rgba($primary, 0.12), 0 26px 70px rgba(0, 0, 0, 0.72); }
:global(body.body--dark) .welcome-text { color: #fff; }
:global(body.body--dark) .subtitle, :global(body.body--dark) .help-text { color: rgba(255, 255, 255, 0.72); }
:global(body.body--dark) .login-input :deep(.q-field__control) { background: #1a1c23; }
:global(body.body--dark) .login-input :deep(.q-field__native), :global(body.body--dark) .login-input :deep(.q-field__label), :global(body.body--dark) .login-input :deep(.q-icon) { color: rgba(255, 255, 255, 0.82); }
:global(body.body--dark) .login-input :deep(.q-field__control:before) { border-color: rgba(255, 255, 255, 0.38); }
:global(body.body--dark) .login-input :deep(.q-field__control:hover:before) { border-color: $primary; }
</style>
