<script>
import api from "@/services/api.service";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";
import authService from "@/services/auth.service";

export default {
  components: { InputText, Button, DatePicker, Select, Password },
  setup() { return { toast: useToast() }; },
  data() {
    return {
      form: { HoLot: "", Ten: "", NgaySinh: null, Phai: "", DiaChi: "", DienThoai: "", Email: "" },
      maDocGia: "",
      viPham: 0,
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
      this.maDocGia = d.MaDocGia;
      this.viPham = d.SoLanViPham || 0;
      this.form.HoLot = d.HoLot || "";
      this.form.Ten = d.Ten || "";
      this.form.Phai = d.Phai || "";
      this.form.DiaChi = d.DiaChi || "";
      this.form.DienThoai = d.DienThoai || "";
      this.form.Email = d.Email || "";
      if (d.NgaySinh) {
        const m = String(d.NgaySinh).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) this.form.NgaySinh = new Date(+m[1], +m[2] - 1, +m[3]);
      }
    } catch (e) {
      this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
    }
  },
  methods: {
    validateInfo() {
      this.errors = {};
      if (!this.form.HoLot || !this.form.Ten) this.errors.HoTen = "Họ tên bắt buộc";
      if (!this.form.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.Email)) this.errors.Email = "Email không hợp lệ";
      if (this.form.DienThoai && !/^(09|03|07|08|05)[0-9]{8}$/.test(this.form.DienThoai)) this.errors.DienThoai = "SĐT không hợp lệ";
      return Object.keys(this.errors).length === 0;
    },
    async saveInfo() {
      if (!this.validateInfo()) return;
      this.infoLoading = true;
      try {
        const payload = {
          HoLot: this.form.HoLot,
          Ten: this.form.Ten,
          Phai: this.form.Phai,
          DiaChi: this.form.DiaChi,
          DienThoai: this.form.DienThoai,
          Email: this.form.Email,
        };
        if (this.form.NgaySinh) {
          const d = this.form.NgaySinh;
          payload.NgaySinh = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }
        await api("/api").put("/auth/ho-so", payload);
        this.toast.add({ severity: "success", summary: "OK", detail: "Đã lưu", life: 2000 });
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
      } finally {
        this.infoLoading = false;
      }
    },
    validatePw() {
      this.pwErrors = {};
      if (!this.pw.moi || this.pw.moi.length < 6) this.pwErrors.moi = "Mật khẩu mới >= 6 ký tự";
      if (this.pw.moi === this.pw.cu) this.pwErrors.moi = "Mật khẩu mới phải khác mật khẩu cũ";
      if (this.pw.lai !== this.pw.moi) this.pwErrors.lai = "Mật khẩu không khớp";
      if (!this.pw.cu) this.pwErrors.cu = "Nhập mật khẩu cũ";
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
    <h1>Hồ sơ</h1>
    <p>Mã độc giả: {{ maDocGia }} — Vi phạm: {{ viPham }}/3</p>
    <h2>Thông tin cá nhân</h2>
    <form @submit.prevent="saveInfo">
      <InputText v-model="form.HoLot" placeholder="Họ lót" class="mb-2 w-full" />
      <small class="err">{{ errors.HoTen }}</small>
      <InputText v-model="form.Ten" placeholder="Tên" class="mb-2 w-full" />
      <Select v-model="form.Phai" :options="[{label:'Nam',value:'Nam'},{label:'Nữ',value:'Nu'}]" optionLabel="label" optionValue="value" placeholder="Giới tính" class="mb-2 w-full" />
      <DatePicker v-model="form.NgaySinh" dateFormat="dd/mm/yy" class="mb-2 w-full" />
      <InputText v-model="form.DiaChi" placeholder="Địa chỉ" class="mb-2 w-full" />
      <InputText v-model="form.DienThoai" placeholder="SĐT" class="mb-2 w-full" />
      <small class="err">{{ errors.DienThoai }}</small>
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

