<script>
import Card from "primevue/card";
import NhaXuatBanForm from "@/components/NhaXuatBanForm.vue";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { useToast } from "primevue/usetoast";

export default {
  components: { Card, NhaXuatBanForm },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      nxb: null,
    };
  },
  setup() {
    return { toast: useToast() };
  },
  methods: {
    async getNxb(id) {
      try {
        this.nxb = await NhaXuatBanService.get(id);
      } catch (error) {
        console.log(error);
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    async updateNxb(data) {
      try {
        await NhaXuatBanService.update(this.nxb._id, data);
        this.toast.add({
          severity: "success",
          summary: "Thành công",
          detail: "Cập nhật nhà xuất bản thành công.",
          life: 3000,
        });
        this.$router.push({ name: "nhaxuatban.list" });
      } catch (error) {
        console.log(error);
        this.toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: error.response?.data?.message || "Không thể cập nhật nhà xuất bản.",
          life: 3000,
        });
      }
    },
  },
  created() {
    this.getNxb(this.id);
  },
};
</script>

<template>
  <div class="page-container" v-if="nxb">
    <Card>
      <template #title>Hiệu chỉnh nhà xuất bản</template>
      <template #content>
        <NhaXuatBanForm :nxb="nxb" @submit:nxb="updateNxb" />
      </template>
    </Card>
  </div>
</template>

