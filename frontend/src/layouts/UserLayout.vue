<script setup>
import HeaderUser from "../components/headerUser.vue";
import FooterUser from "../components/footerUser.vue";
</script>

<template>
  <div class="app">
    <HeaderUser class="header-user" />
    <main class="content">
      <router-view />
    </main>
    <FooterUser />
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-user {
  display: flex;
  height: fit-content;
}

.content {
  background: #111827;
  flex: 1;
  padding: 24px;
}
</style>
