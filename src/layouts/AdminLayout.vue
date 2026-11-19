<script>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import authService from "@/services/auth.service";
import { useRouter } from "vue-router";

export default {
  components: {
    Menubar,
    Button,
  },
  data() {
    return {
      items: [
        { label: "Mượn trả", command: () => this.$router.push("/admin") },
        { label: "Sách", command: () => this.$router.push("/admin") },
        { label: "Nhà xuất bản", command: () => this.$router.push("/admin/nhaxuatban") },
        { label: "Độc giả", command: () => this.$router.push("/admin") },
        { label: "Nhân viên", command: () => this.$router.push("/admin") },
      ],
    };
  },
  computed: {
    user() {
      return authService.getUser();
    },
  },
  methods: {
    logout() {
      authService.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<template>
  <div class="admin-layout">
    <Menubar :model="items">
      <template #start>
        <span class="text-lg font-bold">Quản lý mượn sách</span>
      </template>
      <template #end>
        <span class="mr-2">{{ user?.HoTenNV || user?.ma }}</span>
        <Button label="Đăng xuất" icon="pi pi-sign-out" @click="logout" size="small" />
      </template>
    </Menubar>
    <div class="page-container">
      <router-view />
    </div>
  </div>
</template>