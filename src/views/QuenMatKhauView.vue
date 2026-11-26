<script>
import SelectButton from "primevue/selectbutton";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import authService from "@/services/auth.service";

export default {
  components: { SelectButton, InputText, Button },
  setup() { return { toast: useToast() }; },
  data() {
    return {
      role: "docgia",
      email: "",
      loading: false,
      roleOptions: [
        { label: "Độc giả", value: "docgia" },
        { label: "Nhân viên", value: "nhanvien" },
      ],
      sent: false,
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        await authService.quenMatKhau(this.role, this.email);
        this.sent = true;
        this.toast.add({ severity: "info", summary: "Thông báo", detail: "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.", life: 4000 });
      } catch (e) {
        this.toast.add({ severity: "info", summary: "Thông báo", detail: "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.", life: 4000 });
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
      <h1 class="login-title">Quên mật khẩu</h1>
      <SelectButton v-model="role" :options="roleOptions" optionLabel="label" optionValue="value" class="mb-3" />
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <InputText v-model="email" class="w-full" />
        </div>
        <Button type="submit" label="Gửi liên kết" :loading="loading" class="w-full" />
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

