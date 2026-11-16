<template>
  <div class="page">
    <h4>Thêm nhà xuất bản</h4>
    <NhaXuatBanForm :nxb="nxb" @submit:nxb="addNxb" />
    <p class="text-danger">{{ message }}</p>
  </div>
</template>

<script>
import NhaXuatBanForm from "@/components/NhaXuatBanForm.vue";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  components: { NhaXuatBanForm },
  data() {
    return {
      nxb: { MaNXB: "", TenNXB: "", DiaChi: "" },
      message: "",
    };
  },
  methods: {
    async addNxb(data) {
      try {
        await NhaXuatBanService.create(data);
        alert("Thêm nhà xuất bản thành công.");
        this.$router.push({ name: "nhaxuatban.list" });
      } catch (error) {
        console.log(error);
        // Hiện thông báo từ server (ví dụ: Mã NXB đã tồn tại)
        this.message =
          error.response?.data?.message || "Không thể thêm nhà xuất bản.";
      }
    },
  },
};
</script>