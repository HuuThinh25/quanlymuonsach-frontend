<script>
import SelectButton from "primevue/selectbutton";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import authService from "@/services/auth.service";

export default {
  components: { SelectButton, InputText, Password, Button },
  data() {
    return {
      role: "docgia",
      ma: "",
      password: "",
      error: "",
      loading: false,
      roleOptions: [
        { label: "Độc giả", value: "docgia" },
        { label: "Nhân viên", value: "nhanvien" },
      ],
    };
  },
  methods: {
    async submit() {
      this.error = "";
      if (!this.ma || !this.password) {
        this.error = "Vui lòng nhập mã và mật khẩu";
        return;
      }
      this.loading = true;
      try {
        await authService.login(this.role, this.ma, this.password);
        this.$router.push(authService.homeOf(this.role));
      } catch (e) {
        this.error = e.response?.data?.message || "Đăng nhập thất bại";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo"><i class="pi pi-book"></i></div>
      <h1 class="auth-title">Quản lý mượn sách</h1>
      <p class="auth-sub">Đăng nhập để tiếp tục</p>
      <SelectButton v-model="role" :options="roleOptions" optionLabel="label" optionValue="value" class="mb-3 w-full" />
      <form @submit.prevent="submit">
        <div class="field">
          <label class="form-label">Mã</label>
          <InputText v-model="ma" class="w-full" />
        </div>
        <div class="field">
          <label class="form-label">Mật khẩu</label>
          <Password v-model="password" :feedback="false" toggleMask class="w-full" />
        </div>
        <small v-if="error" class="err">{{ error }}</small>
        <Button type="submit" label="Đăng nhập" :loading="loading" class="w-full mt-2" />
      </form>
      <div class="auth-links">
        <router-link v-if="role === 'docgia'" to="/dang-ky">Chưa có tài khoản? Đăng ký</router-link>
        <router-link to="/quen-mat-khau">Quên mật khẩu?</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.auth-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,.08); padding: 2rem; width: 100%; max-width: 420px; }
.auth-logo { text-align: center; font-size: 2rem; color: #42b883; margin-bottom: .5rem; }
.auth-title { text-align: center; margin: 0 0 .25rem; font-size: 1.4rem; }
.auth-sub { text-align: center; color: #6b7280; margin: 0 0 1.25rem; }
.auth-links { display: flex; justify-content: space-between; margin-top: 1rem; font-size: .9rem; }
.err { color: #d32f2f; display: block; margin-bottom: .5rem; }
.mt-2 { margin-top: .5rem; }
</style>

