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
    isQuanLy() { return this.user?.ChucVu === "QuanLy"; },
  },
};
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2>Quản trị</h2>
      <router-link to="/admin">Tổng quan</router-link>
      <router-link to="/admin/muonsach">Mượn trả</router-link>
      <router-link to="/admin/sach">Sách</router-link>
      <router-link to="/admin/nhaxuatban">Nhà xuất bản</router-link>
      <router-link to="/admin/docgia">Độc giả</router-link>
      <router-link v-if="isQuanLy" to="/admin/nhanvien">Nhân viên</router-link>
      <router-link to="/admin/ho-so">Hồ sơ</router-link>
      <a href="#" @click.prevent="logout">Đăng xuất</a>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.sidebar { width: 220px; padding: 1rem; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; gap: 0.5rem; }
.sidebar a { text-decoration: none; color: #333; padding: 0.4rem 0.6rem; border-radius: 4px; }
.sidebar a:hover { background: #f0f0f0; }
.content { flex: 1; padding: 1.5rem; }
</style>