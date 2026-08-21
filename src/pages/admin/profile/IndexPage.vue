<template>
  <div class="profile-page q-pa-lg">
    <div class="profile-shell">
      <aside class="profile-sidebar">
        <div class="brand-mini"><q-icon name="diamond" size="18px" /> MEMBER AREA</div>
        <div class="user-mini q-mt-xl">
          <q-avatar size="72px" class="avatar-gold">{{ initials }}</q-avatar>
          <div class="text-subtitle1 text-weight-bold q-mt-md">{{ displayName }}</div>
          <div class="text-caption text-grey-6">{{ role }}</div>
          <q-badge class="premium-badge q-mt-sm">PREMIUM MEMBER</q-badge>
        </div>
        <q-list class="profile-nav q-mt-xl">
          <q-item v-for="item in navItems" :key="item.label" clickable :active="item.active" active-class="nav-active" class="nav-item">
            <q-item-section avatar><q-icon :name="item.icon" size="20px" /></q-item-section><q-item-section>{{ item.label }}</q-item-section><q-item-section side v-if="item.active"><q-icon name="chevron_right" size="18px" /></q-item-section>
          </q-item>
        </q-list>
        <q-btn flat no-caps class="logout-btn absolute-bottom q-ma-md" icon="logout" label="Keluar dari akun" @click="logout" />
      </aside>
      <main class="profile-content">
        <div class="row items-center justify-between q-mb-xl"><div><div class="eyebrow">ACCOUNT OVERVIEW</div><h1 class="page-title">Profil Saya</h1><div class="text-grey-6">Kelola informasi akun dan preferensi Anda.</div></div><q-btn unelevated no-caps class="edit-btn" icon="people" label="Profil Anda" /></div>
        <section class="hero-card q-mb-lg"><div class="hero-glow"></div><div class="row items-center relative-position"><q-avatar size="100px" class="avatar-gold large-avatar">{{ initials }}</q-avatar><div class="q-ml-lg"><div class="text-overline text-grey-6">WELCOME BACK</div><div class="hero-name">{{ displayName }}</div><div class="text-grey-5">{{ email || 'Email belum diatur' }}</div></div><div class="q-ml-auto text-right desktop-only"><div class="text-caption text-grey-6">STATUS AKUN</div><div class="status-line"><span class="status-dot"></span> Aktif dan terverifikasi</div></div></div></section>
        <div class="row q-col-gutter-lg"><div class="col-12 col-md-7"><q-card flat class="dark-card full-height"><q-card-section><div class="section-title">Informasi personal</div><div class="section-caption">Data dasar yang terhubung dengan akun Anda</div></q-card-section><q-separator dark /><q-card-section class="row q-col-gutter-lg"><div class="col-12 col-sm-6 detail"><q-icon name="person_outline" /><span><small>Nama lengkap</small>{{ displayName }}</span></div><div class="col-12 col-sm-6 detail"><q-icon name="alternate_email" /><span><small>Username</small>{{ username }}</span></div><div class="col-12 col-sm-6 detail"><q-icon name="mail_outline" /><span><small>Email</small>{{ email || '-' }}</span></div><div class="col-12 col-sm-6 detail"><q-icon name="badge" /><span><small>Peran akses</small>{{ role }}</span></div></q-card-section></q-card></div><div class="col-12 col-md-5"><q-card flat class="dark-card full-height"><q-card-section><div class="section-title">Keamanan akun</div><div class="section-caption">Perlindungan akun Anda saat ini</div></q-card-section><q-separator dark /><q-card-section><div class="security-row"><q-icon name="lock_outline" /><div><div class="text-weight-medium">Password</div><small class="text-grey-6">Terakhir diubah 30 hari lalu</small></div><q-icon name="check_circle" color="amber-7" class="q-ml-auto" /></div><div class="security-row q-mt-lg"><q-icon name="verified_user" /><div><div class="text-weight-medium">Verifikasi akun</div><small class="text-grey-6">Akun Anda sudah terverifikasi</small></div><q-icon name="check_circle" color="amber-7" class="q-ml-auto" /></div></q-card-section></q-card></div></div>
        <div class="row q-col-gutter-lg q-mt-lg"><div class="col-12 col-sm-4" v-for="stat in stats" :key="stat.label"><q-card flat class="stat-card"><q-icon :name="stat.icon" class="stat-icon" /><div class="stat-value">{{ stat.value }}</div><div class="text-caption text-grey-6">{{ stat.label }}</div></q-card></div></div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from 'src/stores/app'
const router = useRouter(); const app = useAppStore(); const user = computed(() => app.user || {})
const displayName = computed(() => user.value.name || user.value.nama || user.value.full_name || user.value.username || 'User Premium')
const username = computed(() => user.value.username || '-'); const email = computed(() => user.value.email || ''); const role = computed(() => user.value.role || user.value.level || 'Administrator')
const initials = computed(() => displayName.value.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase())
const navItems = [{ label: 'Profil saya', icon: 'person_outline', active: true }]
const stats = [{ label: 'Hari aktif', value: '128', icon: 'calendar_today' }, { label: 'Aktivitas bulan ini', value: '24', icon: 'insights' }, { label: 'Level keanggotaan', value: 'Gold', icon: 'workspace_premium' }]
const logout = () => app.logout().then(() => router.push('/auth'))
</script>

<style scoped>
.profile-page{min-height:100%;background:#090909;color:#f5f5f5}.profile-shell{display:flex;min-height:calc(100vh - 48px);background:#101010;border:1px solid #242424;border-radius:24px;overflow:hidden}.profile-sidebar{width:245px;flex:0 0 245px;background:#0b0b0b;padding:30px 18px;position:relative;border-right:1px solid #242424}.brand-mini,.eyebrow{color:#c99d46;font-size:10px;letter-spacing:.22em;font-weight:700}.user-mini{text-align:center}.avatar-gold{background:linear-gradient(135deg,#dcb765,#75551c);color:#171109;font-weight:800;box-shadow:0 0 0 5px #211b0e}.premium-badge{background:#332810;color:#e1bc6a;letter-spacing:.08em;font-size:9px}.profile-nav{color:#777}.nav-item{border-radius:12px;margin-bottom:6px}.nav-active{background:#242019;color:#e0b964}.logout-btn{color:#777;font-size:12px;justify-content:flex-start}.profile-content{flex:1;padding:44px 52px;max-width:1100px}.page-title{font-size:32px;margin:7px 0 4px;letter-spacing:-.03em}.edit-btn{background:#d0a44e;color:#15110a;border-radius:10px;padding:10px 18px;font-weight:700}.hero-card,.dark-card,.stat-card{background:#171717;border:1px solid #292929;border-radius:18px}.hero-card{padding:30px;position:relative;overflow:hidden}.hero-glow{position:absolute;width:260px;height:260px;right:-100px;top:-150px;background:#6c501d;filter:blur(90px);opacity:.35}.hero-name{font-size:27px;font-weight:700}.status-line{color:#b5b5b5;font-size:12px;margin-top:7px}.status-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#d0a44e;margin-right:6px}.section-title{font-size:16px;font-weight:700}.section-caption{color:#666;font-size:11px;margin-top:4px}.detail{display:flex;gap:12px;align-items:center;color:#ddd}.detail>q-icon{color:#bc9141}.detail small{display:block;color:#666;font-size:10px;margin-bottom:3px}.security-row{display:flex;align-items:center;gap:13px}.security-row>q-icon:first-child{color:#bc9141;font-size:22px}.security-row small{font-size:10px}.stat-card{padding:22px;position:relative}.stat-icon{color:#bc9141;position:absolute;right:20px;top:22px}.stat-value{font-size:25px;font-weight:700;margin-bottom:4px}@media(max-width:700px){.profile-page{padding:10px}.profile-shell{display:block;border-radius:16px}.profile-sidebar{width:auto;min-height:0;padding:20px;border-right:0;border-bottom:1px solid #242424}.profile-nav,.logout-btn{display:none}.user-mini{margin-top:16px!important}.profile-content{padding:28px 18px}.page-title{font-size:26px}.edit-btn{padding:8px 12px}.desktop-only{display:none}}
</style>
