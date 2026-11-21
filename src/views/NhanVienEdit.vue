<script>
import Card from "primevue/card";
import NhanVienForm from "@/components/NhanVienForm.vue";
import NhanVienService from "@/services/nhanvien.service";
import { useToast } from "primevue/usetoast";

export default {
  components: { Card, NhanVienForm },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      nhanvien: null,
    };
  },
  setup() {
    return { toast: useToast() };
  },
  methods: {
    async getNhanVien(id) {
      try {
        this.nhanvien = await NhanVienService.get(id);
      } catch (error) {
        console.log(error);
        this.$router.push({
          name: "notfound",
          params: { pathMatch: this.$route.path.split("/").slice(1) },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    async updateNhanVien(data) {
      try {
        await NhanVienService.update(this.nhanvien._id, data);
        this.toast.add({ severity: "success", summary: "Thành công", detail: "Cập nhật nhân viên thành công.", life: 3000 });
        this.$router.push({ name: "nhanvien.list" });
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể cập nhật nhân viên.", life: 3000 });
      }
    },
  },
  created() {
    this.getNhanVien(this.id);
  },
};
</script>

<template>
  <div class="page-container" v-if="nhanvien">
    <Card>
      <template #title>Hiệu chỉnh nhân viên</template>
      <template #content>
        <NhanVienForm :nhanvien="nhanvien" @submit:nhanvien="updateNhanVien" />
      </template>
    </Card>
  </div>
</template>