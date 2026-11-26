<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Select from "primevue/select";
import Tag from "primevue/tag";
import InputSearch from "@/components/InputSearch.vue";
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

export default {
  components: { DataTable, Column, Button, Select, Tag, InputSearch },
  data() {
    return {
      sachs: [],
      nxbList: [],
      nxbMap: {},
      searchText: "",
      theLoai: "",
      maNxb: "",
      loading: false,
    };
  },
  computed: {
    theLoaiOptions() {
      const set = new Set();
      this.sachs.forEach((s) => {
        if (s.TheLoai) set.add(s.TheLoai);
      });
      return Array.from(set).map((v) => ({ label: v, value: v }));
    },
    nxbOptions() {
      return this.nxbList.map((n) => ({ label: n.TenNXB, value: n.MaNXB }));
    },
  },
  setup() {
    return { toast: useToast(), confirm: useConfirm() };
  },
  methods: {
    tenNxb(ma) {
      return this.nxbMap[ma] || ma;
    },
    formatMoney(v) {
      if (v === null || v === undefined) return "";
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
    },
        async retrieve() {
            this.loading = true;
            try {
                const params = { name: this.searchText, theloai: this.theLoai, manxb: this.maNxb };
                if (this.$route.query.saphet === "true") params.saphet = "true";
                const [sachs, nxbList] = await Promise.all([
                    SachService.getAll(params),
                    NhaXuatBanService.getAll(),
                ]);
        this.sachs = sachs;
        this.nxbList = nxbList;
        this.nxbMap = {};
        nxbList.forEach((n) => {
          this.nxbMap[n.MaNXB] = n.TenNXB;
        });
      } catch (error) {
        console.log(error);
        this.toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: error.response?.data?.message || "Không thể tải danh sách.",
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
    clearFilter() {
      this.searchText = "";
      this.theLoai = "";
      this.maNxb = "";
      this.retrieve();
    },
    removeSach(sach) {
      this.confirm.require({
        message: `Bạn muốn xóa sách "${sach.TenSach}"?`,
        header: "Xác nhận xóa",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Xóa",
        rejectLabel: "Hủy",
        accept: async () => {
          try {
            await SachService.delete(sach._id);
            await this.retrieve();
            this.toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Xóa sách thành công.",
              life: 3000,
            });
          } catch (error) {
            console.log(error);
            this.toast.add({
              severity: "error",
              summary: "Lỗi",
              detail: error.response?.data?.message || "Không thể xóa sách.",
              life: 3000,
            });
          }
        },
      });
    },
  },
    mounted() {
        this.retrieve();
    },
    watch: {
        "$route.query.saphet"() { this.retrieve(); },
    },
};
</script>

<template>
  <div class="page-container">
    <div class="list-header">
      <h2>Sách</h2>
      <div class="list-actions">
        <InputSearch v-model="searchText" @submit="retrieve" />
        <Select v-model="theLoai" :options="theLoaiOptions" optionLabel="label" optionValue="value" placeholder="Thể loại" @change="retrieve" />
        <Select v-model="maNxb" :options="nxbOptions" optionLabel="label" optionValue="value" placeholder="Nhà xuất bản" @change="retrieve" />
        <Button label="Xóa lọc" icon="pi pi-filter-slash" severity="secondary" @click="clearFilter" />
        <Button label="Thêm mới" icon="pi pi-plus" @click="$router.push({ name: 'sach.add' })" />
      </div>
    </div>

    <DataTable
      :value="sachs"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="MaSach"
      :sortOrder="1"
      emptyMessage="Không có sách nào."
    >
      <Column field="index" header="STT">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="MaSach" header="Mã sách" sortable />
      <Column field="TenSach" header="Tên sách" sortable />
      <Column field="NguonGocTacGia" header="Tác giả / Nguồn gốc" />
      <Column field="TheLoai" header="Thể loại" />
      <Column header="Nhà xuất bản">
        <template #body="slotProps">
          {{ tenNxb(slotProps.data.MaNXB) }}
        </template>
      </Column>
      <Column field="DonGia" header="Đơn giá" sortable>
        <template #body="slotProps">
          {{ formatMoney(slotProps.data.DonGia) }}
        </template>
      </Column>
      <Column header="Số quyển">
        <template #body="slotProps">
          <span v-if="slotProps.data.SoQuyenCon === 0">
            <Tag severity="danger" value="Hết" />
          </span>
          <span v-else>{{ slotProps.data.SoQuyenCon }}/{{ slotProps.data.SoQuyen }}</span>
        </template>
      </Column>
      <Column header="Thao tác" style="width: 160px">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-warn p-button-sm mr-1"
            @click="$router.push({ name: 'sach.edit', params: { id: slotProps.data._id } })"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            @click="removeSach(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: .75rem; }
.list-actions { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; }
</style>

