<template>
  <div v-if="nxb" class="page">
    <h4>Hiệu chỉnh nhà xuất bản</h4>
    <NhaXuatBanForm :nxb="nxb" @submit:nxb="updateNxb" />
    <p class="text-danger">{{ message }}</p>
  </div>
</template>

<script>
import NhaXuatBanForm from "@/components/NhaXuatBanForm.vue";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  components: { NhaXuatBanForm },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      nxb: null,
      message: "",
    };
  },
  methods: {
    async getNxb(id) {
      try {
        this.nxb = await NhaXuatBanService.get(id);
      } catch (error) {
        console.log(error);
        // Chuyển sang trang NotFound nhưng giữ nguyên URL
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
        alert("Cập nhật nhà xuất bản thành công.");
        this.$router.push({ name: "nhaxuatban.list" });
      } catch (error) {
        console.log(error);
        this.message =
          error.response?.data?.message || "Không thể cập nhật nhà xuất bản.";
      }
    },
  },
  created() {
    this.getNxb(this.id);
  },
};
</script>