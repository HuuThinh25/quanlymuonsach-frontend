<script>
import Card from "primevue/card";
import SachForm from "@/components/SachForm.vue";
import SachService from "@/services/sach.service";
import { useToast } from "primevue/usetoast";

export default {
  components: { Card, SachForm },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      sach: null,
    };
  },
  setup() {
    return { toast: useToast() };
  },
  methods: {
    async getSach(id) {
      try {
        this.sach = await SachService.get(id);
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
    async updateSach(data) {
      try {
        await SachService.update(this.sach._id, data);
        this.toast.add({ severity: "success", summary: "Thành công", detail: "Cập nhật sách thành công.", life: 3000 });
        this.$router.push({ name: "sach.list" });
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể cập nhật sách.", life: 3000 });
      }
    },
  },
  created() {
    this.getSach(this.id);
  },
};
</script>

<template>
  <div class="page-container" v-if="sach">
    <Card>
      <template #title>Hiệu chỉnh sách</template>
      <template #content>
        <SachForm :sach="sach" @submit:sach="updateSach" />
      </template>
    </Card>
  </div>
</template>