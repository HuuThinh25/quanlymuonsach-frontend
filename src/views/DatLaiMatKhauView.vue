<script>
import Password from "primevue/password";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import authService from "@/services/auth.service";

export default {
  components: { Password, Button },
  setup() { return { toast: useToast() }; },
  data() {
    return {
      password: "",
      confirmPassword: "",
      loading: false,
      token: "",
    };
  },
  created() {
    this.token = this.$route.query.token || "";
  },
  methods: {
    async submit() {
      if (!this.password || this.password.length < 6) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: "Mật khẩu >= 6 ký tự", life: 3000 });
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: "Mật khẩu không khớp", life: 3000 });
        return;
      }
      this.loading = true;
      try {
        await authService.datLaiMatKhau(this.token, this.password);
        this.toast.add({ severity: "success", summary: "Thành công", detail: "Đặt lại mật khẩu thành công", life: 3000 });
        this.$router.push("/login");
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Thất bại", life: 3000 });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="login-title">Đặt lại mật khẩu</h1>
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <Password v-model="password" :feedback="false" toggleMask class="w-full" />
        </div>
        <div class="mb-3">
          <label class="form-label">Nhập lại mật khẩu mới</label>
          <Password v-model="confirmPassword" :feedback="false" toggleMask class="w-full" />
        </div>
        <Button type="submit" label="Đặt lại" :loading="loading" class="w-full" />
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.login-card { width: 380px; padding: 2rem; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.login-title { text-align: center; margin-bottom: 1.5rem; font-size: 1.5rem; }
.w-full { width: 100%; }
</style>

