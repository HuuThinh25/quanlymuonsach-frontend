<script>
import api from "@/services/api.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";

export default {
  components: { DataTable, Column, Tag },
  data() { return { list: [] }; },
  async mounted() {
    try {
      const res = await api("/api").get("/muonsach/cua-toi");
      this.list = res.data || [];
    } catch (e) {}
  },
};
</script>

<template>
  <div>
    <h1>Lịch sử mượn</h1>
    <DataTable :value="list">
      <Column field="MaMuon" header="Mã"></Column>
      <Column field="TenSach" header="Sách"></Column>
      <Column field="TrangThai" header="Trạng thái">
        <template #body="{ data }"><Tag :value="data.TrangThai" /></template>
      </Column>
      <Column field="HanTra" header="Hạn trả"></Column>
      <Column field="ViPham" header="Vi phạm"></Column>
    </DataTable>
  </div>
</template>