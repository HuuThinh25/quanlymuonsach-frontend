<script>
import api from "@/services/api.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import { useToast } from "primevue/usetoast";

export default {
  components: { DataTable, Column, Tag },
  setup() { return { toast: useToast() }; },
  data() { return { list: [], loading: false }; },
  methods: {
    fmt(v) {
      if (!v) return "-";
      const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!m) return "-";
      return `${m[3]}/${m[2]}/${m[1]}`;
    },
    isOverdue(p) {
      if (p.TrangThai !== "DangMuon" || !p.HanTra) return false;
      return new Date() > new Date(p.HanTra);
    },
    label(p) {
      if (p.TrangThai === "ChoDuyet") return "Chờ duyệt";
      if (p.TrangThai === "DangMuon") return this.isOverdue(p) ? "Quá hạn" : "Đang mượn";
      if (p.TrangThai === "DaTra") return "Đã trả";
      if (p.TrangThai === "TuChoi") return "Từ chối";
      return p.TrangThai;
    },
    sev(p) {
      if (p.TrangThai === "ChoDuyet") return "warn";
      if (p.TrangThai === "DangMuon") return this.isOverdue(p) ? "danger" : "info";
      if (p.TrangThai === "DaTra") return "success";
      return "secondary";
    },
  },
  async mounted() {
    this.loading = true;
    try {
      const res = await api("/api").get("/muonsach/cua-toi");
      this.list = (res.data || []).sort((a, b) => new Date(b.NgayYeuCau) - new Date(a.NgayYeuCau));
    } catch (e) {
      this.toast.add({ severity: "error", summary: "Lỗi", detail: e.response?.data?.message || "Lỗi", life: 3000 });
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <div>
    <h1>Lịch sử mượn</h1>
    <DataTable :value="list" :loading="loading" emptyMessage="Không có phiếu mượn nào.">
      <Column header="Sách">
        <template #body="{ data }">{{ data.TenSach }}</template>
      </Column>
      <Column header="Ngày yêu cầu">
        <template #body="{ data }">{{ fmt(data.NgayYeuCau) }}</template>
      </Column>
      <Column header="Ngày mượn">
        <template #body="{ data }">{{ fmt(data.NgayMuon) }}</template>
      </Column>
      <Column header="Hạn trả">
        <template #body="{ data }">
          <span :class="{ 'text-danger font-bold': isOverdue(data) }">{{ fmt(data.HanTra) }}</span>
        </template>
      </Column>
      <Column header="Ngày trả">
        <template #body="{ data }">{{ fmt(data.NgayTra) }}</template>
      </Column>
      <Column header="Trạng thái">
        <template #body="{ data }">
          <Tag :severity="sev(data)" :value="label(data)" />
        </template>
      </Column>
      <Column header="Vi phạm">
        <template #body="{ data }">
          <Tag v-if="data.ViPham === 'QuaHan'" severity="danger" value="Quá hạn" />
          <Tag v-else-if="data.ViPham === 'HuHong'" severity="danger" value="Hư hỏng" />
          <span v-else>-</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
