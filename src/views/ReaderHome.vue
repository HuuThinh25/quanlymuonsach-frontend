<script>
import api from "@/services/api.service";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import { useToast } from "primevue/usetoast";
import BookCover from "@/components/BookCover.vue";
import authService from "@/services/auth.service";

export default {
  components: { Card, Button, InputText, Select, BookCover },
  setup() { return { toast: useToast() }; },
  setup() { return { toast: useToast() }; },
  data() {
    return {
      books: [],
      theLoai: "",
      nxb: "",
      search: "",
      categories: [],
      nxbOptions: [],
      nxbMap: {},
      userInfo: null,
      canhBao: "",
    };
  },
  async mounted() {
    await this.loadFilters();
    await this.load();
    if (authService.isLoggedIn() && authService.getRole() === "docgia") {
      try {
        const me = await api("/api").get("/auth/me");
        this.userInfo = me.data;
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
      }
      try {
        const res = await api("/api").get("/muonsach/cua-toi");
        const phieus = res.data || [];
        const dangMuon = phieus.filter((p) => p.TrangThai === "DangMuon");
        this.userInfo = { ...this.userInfo, dangMuon: dangMuon.length };
        const now = new Date();
        const quaHan = dangMuon.filter((p) => p.HanTra && now > new Date(p.HanTra)).length;
        const sapDen = dangMuon.filter((p) => {
          if (!p.HanTra) return false;
          const han = new Date(p.HanTra);
          const diff = (han - now) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 3;
        }).length;
        if (quaHan > 0) this.canhBao = `Có ${quaHan} sách quá hạn`;
        else if (sapDen > 0) this.canhBao = `${sapDen} sách sắp đến hạn trong 3 ngày`;
        else this.canhBao = "";
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
      }
    }
  },
    methods: {
      nxbName(ma) { return this.nxbMap[ma] || ma; },
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
        this.nxbMap = {};
        (nxb.data || []).forEach((x) => { this.nxbMap[x.MaNXB] = x.TenNXB; });
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
}; 
</script>

<template>
  <div>
    <div v-if="userInfo" class="info-bar">
      Vi phạm: {{ userInfo.SoLanViPham || 0 }}/3 — đang mượn: {{ userInfo.dangMuon || 0 }}
      <span v-if="canhBao" class="warn"> — {{ canhBao }}</span>
    </div>
    <div class="filters">
      <InputText v-model="search" placeholder="Tìm theo tên" />
      <Button label="Tìm" icon="pi pi-search" @click="load" />
      <Select v-model="theLoai" :options="categories" placeholder="Thể loại" showClear optionLabel="label" optionValue="value" @change="load" />
      <Select v-model="nxb" :options="nxbOptions" placeholder="Nhà xuất bản" showClear optionLabel="label" optionValue="value" @change="load" />
    </div>
    <div class="grid">
      <Card v-for="b in books" :key="b._id" class="book">
        <template #title>{{ b.TenSach }}</template>
        <template #subtitle>{{ b.NguonGocTacGia }} — {{ b.TheLoai }}</template>
        <template #content>
          <BookCover :book="b" />
          <p>NXB: {{ nxbName(b.MaNXB) }}</p>
          <p>Còn {{ b.SoQuyenCon }} quyển</p>
          <Button label="Mượn" :disabled="b.SoQuyenCon <= 0 || (userInfo && userInfo.SoLanViPham >= 3)" :title="b.SoQuyenCon <= 0 ? 'Hết sách' : (userInfo && userInfo.SoLanViPham >= 3 ? 'Bị cấm mượn' : '')" @click="borrow(b)" />
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.info-bar { background: #ecfdf5; padding: .75rem 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; gap: .5rem; flex-wrap: wrap; }
.info-bar .warn { color: #b45309; font-weight: 600; }
.filters { display: flex; gap: .5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem; }
.book { transition: transform .15s, box-shadow .15s; }
.book:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.08); }
.book-title { font-weight: 700; font-size: 1.05rem; margin-bottom: .25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.meta { color: #6b7280; font-size: .85rem; }
.empty { text-align: center; color: #6b7280; padding: 2rem; }
</style>
