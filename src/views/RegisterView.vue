<script>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import authService from "@/services/auth.service";

export default {
  components: { InputText, Password, Button },
  setup() { return { toast: useToast() }; },
  data() {
    return {
      hoTen: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      loading: false,
      resultMa: null,
    };
  },
  methods: {
    validate() {
      this.errors = {};
      if (!this.email) this.errors.email = "Email bắt buộc";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) this.errors.email = "Email không hợp lệ";
      if (!this.password || this.password.length < 6) this.errors.password = "Mật khẩu >= 6 ký tự";
      if (this.confirmPassword !== this.password) this.errors.confirmPassword = "Mật khẩu không khớp";
      if (!this.hoTen) this.errors.hoTen = "Họ tên bắt buộc";
      return Object.keys(this.errors).length === 0;
    },
    async submit() {
      if (!this.validate()) return;
      this.loading = true;
      try {
        const res = await authService.dangKy({ hoTen: this.hoTen, email: this.email, password: this.password });
        this.resultMa = res.maDocGia;
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Đăng ký thất bại", life: 3000 });
      } finally {
        this.loading = false;
      }
    },
    goLogin() { this.$router.push("/login"); },
  },
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="login-title">Đăng ký độc giả</h1>
      <div v-if="resultMa">
        <p>Mã độc giả của bạn: <strong>{{ resultMa }}</strong></p>
        <Button label="Sang đăng nhập" @click="goLogin" class="w-full" />
      </div>
      <form v-else @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">Họ tên</label>
          <InputText v-model="hoTen" class="w-full" />
          <small class="err">{{ errors.hoTen }}</small>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <InputText v-model="email" class="w-full" />
          <small class="err">{{ errors.email }}</small>
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <Password v-model="password" :feedback="false" toggleMask class="w-full" />
          <small class="err">{{ errors.password }}</small>
        </div>
        <div class="mb-3">
          <label class="form-label">Nhập lại mật khẩu</label>
          <Password v-model="confirmPassword" :feedback="false" toggleMask class="w-full" />
          <small class="err">{{ errors.confirmPassword }}</small>
        </div>
        <Button type="submit" label="Đăng ký" :loading="loading" class="w-full" />
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.login-card { width: 400px; padding: 2rem; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.login-title { text-align: center; margin-bottom: 1.5rem; font-size: 1.5rem; }
.w-full { width: 100%; }
.err { color: #d32f2f; }
</style>
