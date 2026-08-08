<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round icon="store" size="lg" />
        <q-toolbar-title>
          <span class="text-h6">MoonCart</span>
        </q-toolbar-title>
        <q-input rounded dense placeholder="Search for products" filled>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn flat icon="shopping_cart" class="q-ml-sm" />
        <q-btn flat icon="person" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-dark text-white">
      <div class="text-center q-py-md">
        © 2025 MoonCart | All Rights Reserved
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
};
</script>
