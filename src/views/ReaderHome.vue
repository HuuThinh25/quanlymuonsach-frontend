<script>
import api from "@/services/api.service";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import authService from "@/services/auth.service";

export default {
  components: { Card, Button, InputText, Dropdown },
  setup() { return { toast: useToast() }; },
  data() {
    return {
      books: [],
      theLoai: "",
      nxb: "",
      search: "",
      categories: [],
      nxbOptions: [],
      userInfo: null,
    };
  },
  async mounted() {
    await this.loadFilters();
    await this.load();
    if (authService.isLoggedIn() && authService.getRole() === "docgia") {
      try {
        const res = await api("/api").get("/auth/me");
        this.userInfo = res.data;
      } catch (e) {}
    }
  },
  methods: {
    async loadFilters() {
      try {
        const [all, nxb] = await Promise.all([
          api("/api").get("/sach"),
          api("/api").get("/nhaxuatban"),
        ]);
        const set = new Set();
        (all.data || []).forEach((s) => { if (s.TheLoai) set.add(s.TheLoai); });
        this.categories = Array.from(set).map((v) => ({ label: v, value: v }));
        this.nxbOptions = (nxb.data || []).map((x) => ({ label: x.TenNXB, value: x.MaNXB }));
      } catch (e) {}
    },
    async load() {
      try {
          const params = {};
          if (this.search) params.name = this.search;
          if (this.theLoai) params.theloai = this.theLoai;
          if (this.nxb) params.manxb = this.nxb;
        const res = await api("/api").get("/sach", { params });
        this.books = res.data || [];
      } catch (e) {}
    },
    async borrow(b) {
      if (!authService.isLoggedIn()) { this.$router.push("/login"); return; }
      try {
        await api("/api").post("/muonsach/yeu-cau", { MaSach: b.MaSach });
        this.toast.add({ severity: "success", summary: "OK", detail: "Đã gửi yêu cầu mượn", life: 3000 });
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
      }
    },
  },
  watch: { search() { this.load(); }, theLoai() { this.load(); }, nxb() { this.load(); } },
}; 
</script>

<template>
  <div>
    <div v-if="userInfo" class="info-bar">
      Vi phạm: {{ userInfo.SoLanViPham || 0 }}/3 — đang mượn: {{ (userInfo.dangMuon || 0) }}
    </div>
    <div class="filters">
      <InputText v-model="search" placeholder="Tìm theo tên" />
      <Dropdown v-model="theLoai" :options="categories" placeholder="Thể loại" showClear optionLabel="label" optionValue="value" @change="load" />
      <Dropdown v-model="nxb" :options="nxbOptions" placeholder="Nhà xuất bản" showClear optionLabel="label" optionValue="value" @change="load" />
    </div>
    <div class="grid">
      <Card v-for="b in books" :key="b._id" class="book">
        <template #title>{{ b.TenSach }}</template>
        <template #subtitle>{{ b.TacGia }} — {{ b.TheLoai }}</template>
        <template #content>
          <p>NXB: {{ b.TenNXB }}</p>
          <p>Còn {{ b.SoQuyenCon }} quyển</p>
          <Button label="Mượn" :disabled="b.SoQuyenCon <= 0" @click="borrow(b)" />
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem; }
.info-bar { background: #e3f2fd; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; }
</style>