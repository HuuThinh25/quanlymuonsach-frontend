<script>
import api from "@/services/api.service";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import authService from "@/services/auth.service";

export default {
  components: { InputText, Button },
  setup() { return { toast: useToast() }; },
  data() {
    return { form: { HoLot: "", Ten: "", Email: "", NgaySinh: "", DiaChi: "", SoDienThoai: "" }, password: "", loading: false };
  },
  async mounted() {
    try {
      const res = await api("/api").get("/auth/me");
      this.form = { ...this.form, ...res.data };
    } catch (e) {}
  },
  methods: {
    async save() {
      this.loading = true;
      try {
        const payload = { ...this.form };
        if (this.password) payload.Password = this.password;
        await api("/api").put("/auth/ho-so", payload);
        this.toast.add({ severity: "success", summary: "OK", detail: "Đã lưu", life: 2000 });
      } catch (e) { this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 }); }
      finally { this.loading = false; }
    },
  },
};
</script>

<template>
  <div>
    <h1>Hồ sơ</h1>
    <p>Mã độc giả: {{ form.MaDocGia }} — Vi phạm: {{ form.SoLanViPham || 0 }}/3</p>
    <form @submit.prevent="save">
      <InputText v-model="form.HoLot" placeholder="Họ lót" class="mb-2 w-full" />
      <InputText v-model="form.Ten" placeholder="Tên" class="mb-2 w-full" />
      <InputText v-model="form.Email" placeholder="Email" class="mb-2 w-full" />
      <InputText v-model="form.NgaySinh" placeholder="Ngày sinh (yyyy-mm-dd)" class="mb-2 w-full" />
      <InputText v-model="form.DiaChi" placeholder="Địa chỉ" class="mb-2 w-full" />
      <InputText v-model="form.SoDienThoai" placeholder="SĐT" class="mb-2 w-full" />
      <InputText v-model="password" type="password" placeholder="Mật khẩu mới (để trống = không đổi)" class="mb-2 w-full" />
      <Button type="submit" label="Lưu" :loading="loading" />
    </form>
  </div>
</template>

<style scoped>
.w-full { width: 100%; }
.mb-2 { margin-bottom: 0.5rem; }
</style>