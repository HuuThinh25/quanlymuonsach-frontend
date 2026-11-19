<script>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import authService from "@/services/auth.service";

export default {
  components: {
    Menubar,
    Button,
  },
  data() {
    return {
      items: [
        { label: "Sách", command: () => this.$router.push("/") },
        { label: "Lịch sử mượn", disabled: true },
        { label: "Hồ sơ", disabled: true },
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
  <div class="reader-layout">
    <Menubar :model="items">
      <template #start>
        <span class="text-lg font-bold">Quản lý mượn sách</span>
      </template>
      <template #end>
        <span class="mr-2">{{ user?.HoLot }} {{ user?.Ten }}</span>
        <Button label="Đăng xuất" icon="pi pi-sign-out" @click="logout" size="small" />
      </template>
    </Menubar>
    <div class="page-container">
      <router-view />
    </div>
  </div>
</template>