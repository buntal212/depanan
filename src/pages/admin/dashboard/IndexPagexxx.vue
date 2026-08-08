<template>
  <div class="q-pa-md fit">
    <!-- Header Section -->
    <q-btn label="Add User" color="primary" @click="openForm" class="q-mb-md" />
    <q-btn label="Export to Excel" color="primary" @click="exportToExcel" />
    <!-- Grid Layout: Form and List -->
    <!-- <q-layout view="lHh Lpr lFf"> -->
      <!-- <div-container> -->
        <!-- <div class="fit column"> -->
          <div class="row full-width">
            <!-- Form Section (Responsive: Takes full width on small screens) -->
            <div :class="`col-${isMobile ? 12 : 12}`" >
              <q-card v-if="formDialogOpen">
                <q-card-section>
                  <div class="text-h6">{{ editingIndex !== null ? 'Edit User' : 'Add User' }}</div>
                  <q-input v-model="form.name" label="Name" />
                  <q-input v-model="form.email" label="Email" type="email" />
                </q-card-section>

                <q-card-actions>
                  <q-btn flat label="Cancel" color="negative" @click="closeForm" />
                  <q-btn flat label="Save" color="primary" @click="saveUser" />
                </q-card-actions>
              </q-card>
            </div>

            <!-- List Section (Responsive: Takes full width on small screens) -->
            <div :class="`col-${isMobile ? 12 : 12}`" >
              <q-list bordered>
                <q-item-label header>Users List</q-item-label>
                <q-item v-for="(user, index) in users" :key="index" clickable>
                  <q-item-section>
                    <div>{{ user.name }}</div>
                    <div>{{ user.email }}</div>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn color="secondary" icon="edit" @click="editUser(user, index)" />
                    <q-btn color="negative" icon="delete" @click="deleteUser(index)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <div class="row full-width">
            <q-table
              :rows="users"
              :columns="columns"
              :rows-per-page-options="[10, 20, 50]"
              row-key="id"
              dense
              flat
              bordered
              class="q-mt-md full-width"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        <!-- </div> -->
      <!-- </div-container> -->
    <!-- </q-layout> -->
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';
import { Workbook } from 'exceljs';


const users = ref([]);  // List of users
const columns = ref([
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
  // ...
]);

// const pagination = ref({
//   rowsPerPage: 10,
// });
const formDialogOpen = ref(false);  // Whether the form dialog is open
const form = ref({
  name: '',
  email: ''
});
const editingIndex = ref(null);  // Index of the user being edited

// Computed property to check if the screen size is mobile
const $q = useQuasar();
const isMobile = computed(() => {
  return $q.screen.lt.sm; // Quasar screen size helper
});

// Methods
const openForm = () => {
  formDialogOpen.value = true;
  resetForm();
};

const closeForm = () => {
  formDialogOpen.value = false;
  resetForm();
};

const resetForm = () => {
  form.value.name = '';
  form.value.email = '';
  editingIndex.value = null;
};

const saveUser = () => {
  if (editingIndex.value === null) {
    // Add new user
    users.value.push({ ...form.value });
  } else {
    // Update existing user
    users.value.splice(editingIndex.value, 1, { ...form.value });
  }
  closeForm();
};

const editUser = (user, index) => {
  form.value.name = user.name;
  form.value.email = user.email;
  editingIndex.value = index;
  formDialogOpen.value = true;
};

const deleteUser = (index) => {
  users.value.splice(index, 1);
};

function exportToExcel() {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Users');

  worksheet.addRow(['Name', 'Email']);

  users.value.forEach((user) => {
    worksheet.addRow([user.name, user.email]);
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.xlsx';
    a.click();
  });
}

</script>

<style scoped>
.q-page {
  padding: 20px;
}

/* Style for mobile view (when screen is small) */
.q-card {
  width: 100%;
}
</style>