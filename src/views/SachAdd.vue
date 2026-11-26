<script>
import Card from "primevue/card";
import SachForm from "@/components/SachForm.vue";
import SachService from "@/services/sach.service";
import { useToast } from "primevue/usetoast";

export default {
  components: { Card, SachForm },
  data() {
    return {
      sach: { MaSach: "", TenSach: "", NguonGocTacGia: "", TheLoai: "", NamXuatBan: null, DonGia: null, SoQuyen: null, MaNXB: "" },
    };
  },
  setup() {
    return { toast: useToast() };
  },
  methods: {
    async addSach(data) {
      try {
        await SachService.create(data);
        this.toast.add({ severity: "success", summary: "Thành công", detail: "Thêm sách thành công.", life: 3000 });
        this.$router.push({ name: "sach.list" });
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể thêm sách.", life: 3000 });
      }
    },
  },
};
</script>

<template>
  <div class="page-container">
    <Card>
      <template #title>Thêm sách</template>
      <template #content>
        <SachForm :sach="sach" @submit:sach="addSach" />
      </template>
    </Card>
  </div>
</template>

