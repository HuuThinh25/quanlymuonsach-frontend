<script>
import { useRouter } from "vue-router";
import authService from "@/services/auth.service";

export default {
  data() { return { collapsed: false }; },
  setup() {
    const router = useRouter();
    function logout() { authService.logout(); router.push("/login"); }
    return { logout, authService };
  },
  computed: {
    user() { return authService.getUser(); },
    isQuanLy() { return this.user?.ChucVu === "QuanLy"; },
    displayName() { return this.user?.HoTenNV || ""; },
    initial() { return this.displayName ? this.displayName.charAt(0).toUpperCase() : "?"; },
  },
};
</script>

<template>
  <div class="admin-shell" :class="{ collapsed }">
    <aside class="sidebar">
      <div class="sidebar-logo"><i class="pi pi-book"></i> Quản lý mượn sách</div>
      <nav class="sidebar-nav">
        <router-link to="/admin" class="side-link"><i class="pi pi-home"></i> Tổng quan</router-link>
        <router-link to="/admin/muonsach" class="side-link"><i class="pi pi-list"></i> Mượn trả</router-link>
        <router-link to="/admin/sach" class="side-link"><i class="pi pi-book"></i> Sách</router-link>
        <router-link to="/admin/nhaxuatban" class="side-link"><i class="pi pi-building"></i> Nhà xuất bản</router-link>
        <router-link to="/admin/docgia" class="side-link"><i class="pi pi-users"></i> Độc giả</router-link>
        <router-link v-if="isQuanLy" to="/admin/nhanvien" class="side-link"><i class="pi pi-id-card"></i> Nhân viên</router-link>
        <router-link to="/admin/ho-so" class="side-link"><i class="pi pi-user"></i> Hồ sơ</router-link>
      </nav>
      <button class="side-logout" @click="logout"><i class="pi pi-sign-out"></i> Đăng xuất</button>
    </aside>
    <div class="main">
      <header class="topbar">
        <div class="topbar-user">
          <span class="avatar">{{ initial }}</span>
          <span>{{ displayName }}</span>
          <span class="role">{{ user?.ChucVu }}</span>
        </div>
      </header>
      <main class="page-container">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; }
.sidebar { width: 240px; background: #fff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; padding: 1rem; gap: .25rem; transition: width .2s; }
.sidebar-logo { font-weight: 700; color: #42b883; margin-bottom: 1rem; display: flex; align-items: center; gap: .4rem; }
.side-link { display: flex; align-items: center; gap: .6rem; padding: .6rem .8rem; border-radius: 8px; text-decoration: none; color: #374151; transition: background .15s; }
.side-link:hover { background: #ecfdf5; }
.side-link.router-link-active { background: #ecfdf5; color: #42b883; font-weight: 600; }
.side-logout { margin-top: auto; background: #f3f4f6; border: none; padding: .6rem .8rem; border-radius: 8px; cursor: pointer; text-align: left; }
.side-logout:hover { background: #e5e7eb; }
.main { flex: 1; display: flex; flex-direction: column; }
.topbar { background: #fff; padding: .75rem 1.5rem; box-shadow: 0 1px 4px rgba(0,0,0,.06); display: flex; align-items: center; justify-content: space-between; }
.topbar-user { display: flex; align-items: center; gap: .5rem; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: #42b883; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }
.role { font-size: .8rem; color: #6b7280; }
.hamburger { background: none; border: none; font-size: 1.2rem; cursor: pointer; }
@media (max-width: 768px) {
  .sidebar { position: fixed; left: -260px; z-index: 20; height: 100vh; }
  .admin-shell:not(.collapsed) .sidebar { left: 0; }
}
</style>
