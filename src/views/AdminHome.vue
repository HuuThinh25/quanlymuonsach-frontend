<script>
import authService from "@/services/auth.service";

export default {
  computed: {
    user() {
      return authService.getUser();
    },
  },
};
</script>

<template>
  <div class="home">
    <h2>Xin chào, {{ user?.HoTenNV || user?.ma }}</h2>
    <p>Vai trò: Nhân viên</p>
  </div>
</template>