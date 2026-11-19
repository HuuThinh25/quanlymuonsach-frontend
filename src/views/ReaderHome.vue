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
    <h2>Xin chào, {{ user?.HoLot }} {{ user?.Ten }}</h2>
    <p>Vai trò: Độc giả</p>
  </div>
</template>