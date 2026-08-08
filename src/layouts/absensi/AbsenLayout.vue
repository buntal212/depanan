<template>
  <q-layout view="lHr LpR lfr">
    <q-page-container>
      <q-page class="fit column">
        <div class="col full-height relative-position">
          <div class="absolute fit q-pa-md">
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
