<script>
import api from "@/services/api.service";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";
import authService from "@/services/auth.service";

export default {
  components: { InputText, Button, Password },
  setup() { return { toast: useToast() }; },
  data() {
    return {
      form: { HoTenNV: "", DiaChi: "", SoDienThoai: "", Email: "" },
      errors: {},
      infoLoading: false,
      pw: { cu: "", moi: "", lai: "" },
      pwErrors: {},
      pwLoading: false,
    };
  },
  async mounted() {
    try {
      const res = await api("/api").get("/auth/me");
      const d = res.data || {};
      this.form.HoTenNV = d.HoTenNV || "";
      this.form.DiaChi = d.DiaChi || "";
      this.form.SoDienThoai = d.SoDienThoai || "";
      this.form.Email = d.Email || "";
    } catch (e) {
      this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
    }
  },
  methods: {
    validateInfo() {
      this.errors = {};
      if (!this.form.HoTenNV) this.errors.HoTenNV = "Họ tên bắt buộc";
      if (!this.form.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.Email)) this.errors.Email = "Email không hợp lệ";
      if (this.form.SoDienThoai && !/^(09|03|07|08|05)[0-9]{8}$/.test(this.form.SoDienThoai)) this.errors.SoDienThoai = "SĐT không hợp lệ";
      return Object.keys(this.errors).length === 0;
    },
    async saveInfo() {
      if (!this.validateInfo()) return;
      this.infoLoading = true;
      try {
        await api("/api").put("/auth/ho-so", { ...this.form });
        this.toast.add({ severity: "success", summary: "OK", detail: "Đã lưu", life: 2000 });
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
      } finally {
        this.infoLoading = false;
      }
    },
    validatePw() {
      this.pwErrors = {};
      if (!this.pw.cu) this.pwErrors.cu = "Nhập mật khẩu cũ";
      if (!this.pw.moi || this.pw.moi.length < 6) this.pwErrors.moi = "Mật khẩu mới >= 6 ký tự";
      if (this.pw.moi === this.pw.cu) this.pwErrors.moi = "Mật khẩu mới phải khác mật khẩu cũ";
      if (this.pw.lai !== this.pw.moi) this.pwErrors.lai = "Mật khẩu không khớp";
      return Object.keys(this.pwErrors).length === 0;
    },
    async changePw() {
      if (!this.validatePw()) return;
      this.pwLoading = true;
      try {
        await authService.doiMatKhau(this.pw.cu, this.pw.moi);
        this.toast.add({ severity: "success", summary: "OK", detail: "Đổi mật khẩu thành công", life: 2000 });
        this.pw = { cu: "", moi: "", lai: "" };
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
      } finally {
        this.pwLoading = false;
      }
    },
  },
};
</script>

<template>
  <div>
    <h1>Hồ sơ nhân viên</h1>
    <h2>Thông tin cá nhân</h2>
    <form @submit.prevent="saveInfo">
      <InputText v-model="form.HoTenNV" placeholder="Họ tên" class="mb-2 w-full" />
      <small class="err">{{ errors.HoTenNV }}</small>
      <InputText v-model="form.DiaChi" placeholder="Địa chỉ" class="mb-2 w-full" />
      <InputText v-model="form.SoDienThoai" placeholder="SĐT" class="mb-2 w-full" />
      <small class="err">{{ errors.SoDienThoai }}</small>
      <InputText v-model="form.Email" placeholder="Email" class="mb-2 w-full" />
      <small class="err">{{ errors.Email }}</small>
      <Button type="submit" label="Lưu" :loading="infoLoading" />
    </form>
    <h2>Đổi mật khẩu</h2>
    <form @submit.prevent="changePw">
      <Password v-model="pw.cu" :feedback="false" toggleMask placeholder="Mật khẩu cũ" class="mb-2 w-full" />
      <small class="err">{{ pwErrors.cu }}</small>
      <Password v-model="pw.moi" :feedback="false" toggleMask placeholder="Mật khẩu mới" class="mb-2 w-full" />
      <small class="err">{{ pwErrors.moi }}</small>
      <Password v-model="pw.lai" :feedback="false" toggleMask placeholder="Nhập lại mật khẩu mới" class="mb-2 w-full" />
      <small class="err">{{ pwErrors.lai }}</small>
      <Button type="submit" label="Đổi mật khẩu" :loading="pwLoading" />
    </form>
  </div>
</template>

<style scoped>
.w-full { width: 100%; }
.mb-2 { margin-bottom: 0.5rem; }
.err { color: #d32f2f; }
</style>

