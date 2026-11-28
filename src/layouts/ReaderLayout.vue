<script>
import { useRouter } from "vue-router";
import authService from "@/services/auth.service";

export default {
  data() { return { user: authService.getUser() }; },
  setup() {
    const router = useRouter();
    function logout() {
      authService.logout();
      router.push("/login");
    }
    return { logout, authService };
  },
  async mounted() {
    try {
      const res = await (await import("@/services/api.service")).default("/api").get("/auth/me");
      const d = res.data || {};
      const u = this.user || {};
      if (u.role === "docgia") { u.HoLot = d.HoLot || u.HoLot; u.Ten = d.Ten || u.Ten; }
      else { u.HoTenNV = d.HoTenNV || u.HoTenNV; }
      this.user = u;
      localStorage.setItem("user", JSON.stringify(u));
    } catch (e) {}
  },
  computed: {
    loggedIn() { return authService.isLoggedIn(); },
    displayName() {
      const u = this.user;
      if (!u) return "";
      return u.role === "docgia" ? (u.HoLot + " " + u.Ten) : (u.HoTenNV || "");
    },
    initial() {
      const n = this.displayName;
      return n ? n.charAt(0).toUpperCase() : "?";
    },
  },
};
</script>

<template>
  <div>
    <header class="reader-header">
      <div class="reader-header-inner page-container">
        <router-link to="/" class="logo">
          <i class="pi pi-book"></i> Quản lý mượn sách
        </router-link>
        <nav class="reader-nav">
          <router-link to="/" class="nav-link">Danh mục sách</router-link>
          <template v-if="loggedIn">
            <router-link to="/lich-su-muon" class="nav-link">Lịch sử mượn</router-link>
            <router-link to="/ho-so" class="nav-link">Hồ sơ</router-link>
            <div class="user-box">
              <span class="avatar">{{ initial }}</span>
              <span class="user-name">{{ displayName }}</span>
              <button class="btn-logout" @click="logout">Đăng xuất</button>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">Đăng nhập</router-link>
            <router-link to="/dang-ky" class="nav-link">Đăng ký</router-link>
          </template>
        </nav>
      </div>
    </header>
    <div class="marquee-strip" aria-label="Kết nối tri thức">
      <div class="marquee-track">
        <div class="marquee-group">
          <span v-for="n in 10" :key="'a'+n">• Thư viện số - Nơi kết nối tri thức • </span>
        </div>
        <div class="marquee-group" aria-hidden="true">
          <span v-for="n in 10" :key="'b'+n">• Thư viện số - Nơi kết nối tri thức • </span>
        </div>
      </div>
    </div>
    <main class="page-container">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.reader-header { background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.08); position: sticky; top: 0; z-index: 10; }
.reader-header-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem; padding-top: .75rem; padding-bottom: .75rem; }
.logo { font-weight: 700; font-size: 1.1rem; color: #42b883; text-decoration: none; display: flex; align-items: center; gap: .4rem; }
.reader-nav { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.nav-link { text-decoration: none; color: #374151; padding: .4rem .7rem; border-radius: 6px; transition: background .15s; }
.nav-link:hover { background: #ecfdf5; }
.nav-link.router-link-active { background: #ecfdf5; color: #42b883; font-weight: 600; }
.user-box { display: flex; align-items: center; gap: .5rem; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: #42b883; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }
.user-name { font-weight: 600; }
.btn-logout { background: #f3f4f6; border: none; padding: .35rem .7rem; border-radius: 6px; cursor: pointer; }
.btn-logout:hover { background: #e5e7eb; }
.marquee-strip { width: 100%; height: 32px; background: #ecfdf5; color: #047857; font-size: .85rem; overflow: hidden; display: flex; align-items: center; }
.marquee-track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
.marquee-group { display: flex; min-width: 100vw; }
.marquee-group span { padding: 0 1rem; white-space: nowrap; }
.marquee-strip:hover .marquee-track { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
</style>

