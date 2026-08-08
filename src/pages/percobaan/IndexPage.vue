<template>
  <q-page class="bg-light">
    <!-- Hero Section -->
    <section class="hero-section text-center q-pa-lg bg-grey-3">
      <div class="text-h4">Shop List</div>
      <div class="text-caption text-grey">
        Discover the best products tailored for you.
      </div>
    </section>

    <!-- Content -->
    <q-page-container class="q-px-md">
      <q-drawer show-if-above v-model="drawer" side="left" width="250px" bordered>
        <div class="q-pa-md">
          <div class="text-h6">Filters</div>
          <q-separator class="q-my-sm" />
          <!-- Categories -->
          <div class="text-subtitle2 q-mb-sm">Categories</div>
          <q-list bordered>
            <q-item v-for="category in categories" :key="category" clickable>
              <q-item-section>{{ category }}</q-item-section>
            </q-item>
          </q-list>
          <!-- Price Range -->
          <div class="text-subtitle2 q-mt-md">Price Range</div>
          <q-range v-model="priceRange" :min="0" :max="1000" label="Price" class="q-my-md" />
        </div>
      </q-drawer>

      <q-page class="q-pa-md">
        <q-card v-for="product in products" :key="product.id" class="q-mb-lg" flat bordered>
          <q-card-section>
            <q-img :src="product.image" ratio="4:3" />
          </q-card-section>
          <q-card-section>
            <div class="text-h6">{{ product.name }}</div>
            <div class="text-subtitle2 text-primary">{{ product.price }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" label="View Details" />
            <q-btn flat color="secondary" label="Add to Cart" />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>

    <!-- Pagination -->
    <div class="text-center q-py-md">
      <q-pagination v-model="page" :max="10" />
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      categories: ["Electronics", "Fashion", "Home & Living", "Books", "Toys"],
      priceRange: [0, 500],
      products: [
        {
          id: 1,
          name: "Product 1",
          price: "$100",
          image: "https://via.placeholder.com/300",
        },
        {
          id: 2,
          name: "Product 2",
          price: "$150",
          image: "https://via.placeholder.com/300",
        },
        {
          id: 3,
          name: "Product 3",
          price: "$200",
          image: "https://via.placeholder.com/300",
        },
      ],
      page: 1,
    };
  },
};
</script>

<style>
.hero-section {
  background-image: url('https://via.placeholder.com/1200x300');
  background-size: cover;
  background-position: center;
  color: white;
}
</style>
