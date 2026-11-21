<script>
import Card from "primevue/card";
import NhanVienForm from "@/components/NhanVienForm.vue";
import NhanVienService from "@/services/nhanvien.service";
import { useToast } from "primevue/usetoast";

export default {
  components: { Card, NhanVienForm },
  data() {
    return {
      nhanvien: { MSNV: "", HoTenNV: "", ChucVu: "", DiaChi: "", SoDienThoai: "", Password: "" },
    };
  },
  setup() {
    return { toast: useToast() };
  },
  methods: {
    async addNhanVien(data) {
      try {
        await NhanVienService.create(data);
        this.toast.add({ severity: "success", summary: "Thành công", detail: "Thêm nhân viên thành công.", life: 3000 });
        this.$router.push({ name: "nhanvien.list" });
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể thêm nhân viên.", life: 3000 });
      }
    },
  },
};
</script>

<template>
  <div class="page-container">
    <Card>
      <template #title>Thêm nhân viên</template>
      <template #content>
        <NhanVienForm :nhanvien="nhanvien" @submit:nhanvien="addNhanVien" />
      </template>
    </Card>
  </div>
</template>