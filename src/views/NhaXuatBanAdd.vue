<script>
import Card from "primevue/card";
import NhaXuatBanForm from "@/components/NhaXuatBanForm.vue";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { useToast } from "primevue/usetoast";

export default {
  components: { Card, NhaXuatBanForm },
  data() {
    return {
      nxb: { MaNXB: "", TenNXB: "", DiaChi: "" },
    };
  },
  setup() {
    return { toast: useToast() };
  },
  methods: {
    async addNxb(data) {
      try {
        await NhaXuatBanService.create(data);
        this.toast.add({
          severity: "success",
          summary: "Thành công",
          detail: "Thêm nhà xuất bản thành công.",
          life: 3000,
        });
        this.$router.push({ name: "nhaxuatban.list" });
      } catch (error) {
        console.log(error);
        this.toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: error.response?.data?.message || "Không thể thêm nhà xuất bản.",
          life: 3000,
        });
      }
    },
  },
};
</script>

<template>
  <div class="page-container">
    <Card>
      <template #title>Thêm nhà xuất bản</template>
      <template #content>
        <NhaXuatBanForm :nxb="nxb" @submit:nxb="addNxb" />
      </template>
    </Card>
  </div>
</template>

