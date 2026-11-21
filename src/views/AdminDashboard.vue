<script>
import api from "@/services/api.service";
import Card from "primevue/card";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import { useToast } from "primevue/usetoast";

export default {
  components: { Card, Button, DataTable, Column, Tag },
  setup() { return { toast: useToast() }; },
  data() {
    return {
      stats: { choDuyet: 0, dangMuon: 0, quaHan: 0, docGiaBiCam: 0, sachSapHet: 0 },
      list: [],
      loading: false,
    };
  },
  async mounted() { await this.load(); },
  methods: {
    async load() {
      this.loading = true;
      try {
        const res = await api("/api").get("/thongke/tong-quan");
        this.stats = res.data.stats || this.stats;
        this.list = res.data.choDuyetMoiNhat || [];
      } catch (e) {
        this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
      } finally { this.loading = false; }
    },
    go(path, query) { this.$router.push({ path, query }); },
    async approve(row) {
      try {
        await api("/api").put(`/muonsach/${row._id}/duyet`);
        this.toast.add({ severity: "success", summary: "OK", detail: "Đã duyệt", life: 2000 });
        await this.load();
      } catch (e) { this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 }); }
    },
    async reject(row) {
      try {
        await api("/api").put(`/muonsach/${row._id}/tu-choi`);
        this.toast.add({ severity: "success", summary: "OK", detail: "Đã từ chối", life: 2000 });
        await this.load();
      } catch (e) { this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 }); }
    },
  },
};
</script>

<template>
  <div>
    <h1>Tổng quan</h1>
    <div class="cards">
      <Card class="stat" @click="go('/admin/muonsach', { trangThai: 'ChoDuyet' })"><template #title>Chờ duyệt</template><template #content>{{ stats.choDuyet }}</template></Card>
      <Card class="stat" @click="go('/admin/muonsach', { trangThai: 'DangMuon' })"><template #title>Đang mượn</template><template #content>{{ stats.dangMuon }}</template></Card>
      <Card class="stat" @click="go('/admin/muonsach', { trangThai: 'QuaHan' })"><template #title>Quá hạn</template><template #content>{{ stats.quaHan }}</template></Card>
      <Card class="stat" @click="go('/admin/docgia', { cam: 'true' })"><template #title>Độc giả bị cấm</template><template #content>{{ stats.docGiaBiCam }}</template></Card>
      <Card class="stat" @click="go('/admin/sach', { saphet: 'true' })"><template #title>Sách sắp hết</template><template #content>{{ stats.sachSapHet }}</template></Card>
    </div>
    <h2>Việc cần làm</h2>
    <DataTable :value="list" :loading="loading">
      <Column field="MaDocGia" header="Mã độc giả"></Column>
      <Column header="Độc giả">
        <template #body="{ data }">{{ data.HoLot }} {{ data.Ten }}</template>
      </Column>
      <Column field="MaSach" header="Mã sách"></Column>
      <Column field="TenSach" header="Tên sách"></Column>
      <Column header="Hành động">
        <template #body="slotProps">
          <Button label="Duyệt" size="small" @click="approve(slotProps.data)" />
          <Button label="Từ chối" size="small" severity="danger" class="ml-2" @click="reject(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.cards { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.stat { cursor:pointer ; min-width: 150px;}
</style>