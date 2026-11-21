<script>
import { useRouter } from "vue-router";
import authService from "@/services/auth.service";

export default {
  setup() {
    const router = useRouter();
    function logout() {
      authService.logout();
      router.push("/login");
    }
    return { logout, authService };
  },
  computed: {
    user() { return authService.getUser(); },
    loggedIn() { return authService.isLoggedIn(); },
  },
};
</script>

<template>
  <div>
    <header class="reader-header">
      <router-link to="/">Danh mục sách</router-link>
      <nav>
        <template v-if="loggedIn">
          <router-link to="/lich-su-muon">Lịch sử mượn</router-link>
          <router-link to="/ho-so">Hồ sơ</router-link>
          <span>{{ user?.HoTenDG || user?.HoTenNV }}</span>
          <a href="#" @click.prevent="logout">Đăng xuất</a>
        </template>
        <template v-else>
          <router-link to="/login">Đăng nhập</router-link>
          <router-link to="/dang-ky">Đăng ký</router-link>
        </template>
      </nav>
    </header>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.reader-header { display: flex; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid #e0e0e0; }
.content { padding: 1.5rem; }
nav { display: flex; gap: 1rem; align-items: center; }
nav a { text-decoration: none; color: #333; }
</style>