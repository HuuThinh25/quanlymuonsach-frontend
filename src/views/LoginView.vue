<script>
import SelectButton from "primevue/selectbutton";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import authService from "@/services/auth.service";

export default {
  components: {
    SelectButton,
    InputText,
    Password,
    Button,
  },
  data() {
    return {
      role: "nhanvien",
      ma: "",
      password: "",
      error: "",
      loading: false,
      roleOptions: [
        { label: "Nhân viên", value: "nhanvien" },
        { label: "Độc giả", value: "docgia" },
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
    handleKeydown(e) {
      if (e.key === "Enter") {
        this.submit();
      }
    },
  },
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="login-title">Quản lý mượn sách</h1>
      <form @submit.prevent="submit" @keydown="handleKeydown">
        <div class="mb-3">
          <label class="form-label">Loại tài khoản</label>
          <SelectButton v-model="role" :options="roleOptions" optionLabel="label" optionValue="value" />
        </div>
        <div class="mb-3">
          <label class="form-label">Mã</label>
          <InputText v-model="ma" class="w-full" />
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <Password v-model="password" :feedback="false" toggleMask class="w-full" />
        </div>
        <Button type="submit" label="Đăng nhập" :loading="loading" class="w-full" />
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.login-card {
  width: 360px;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}
.error-msg {
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
}
.w-full {
  width: 100%;
}
</style>