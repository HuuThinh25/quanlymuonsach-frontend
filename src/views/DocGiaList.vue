<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputSearch from "@/components/InputSearch.vue";
import DocGiaService from "@/services/docgia.service";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

import authService from "@/services/auth.service";

export default {
    components: { DataTable, Column, Button, Tag, InputSearch },
    data() {
        return {
            docgias: [],
            searchText: "",
            loading: false,
        };
    },
    computed: {
        isQuanLy() { return (authService.getUser()?.ChucVu === "QuanLy"); },
    },
    setup() {
        return { toast: useToast(), confirm: useConfirm() };
    },
    methods: {
        formatDate(value) {
            if (!value) return "-";
            const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (!m) return "-";
            return `${m[3]}/${m[2]}/${m[1]}`;
        },
        viPhamSeverity(n) {
            if (n >= 3) return "danger";
            if (n >= 1) return "warn";
            return "success";
        },
        viPhamLabel(n) {
            if (n >= 3) return `${n}/3 - Bị cấm mượn`;
            return `${n}/3`;
        },
        async retrieve() {
            this.loading = true;
            try {
                const params = { name: this.searchText };
                if (this.$route.query.cam === "true") params.cam = "true";
                this.docgias = await DocGiaService.getAll(params);
            } catch (error) {
                console.log(error);
                this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể tải danh sách.", life: 3000 });
            } finally {
                this.loading = false;
            }
        },
        removeDocGia(dg) {
            this.confirm.require({
                message: `Bạn muốn xóa độc giả "${dg.HoLot} ${dg.Ten}"?`,
                header: "Xác nhận xóa",
                icon: "pi pi-exclamation-triangle",
                acceptLabel: "Xóa",
                rejectLabel: "Hủy",
                accept: async () => {
                    try {
                        await DocGiaService.delete(dg._id);
                        await this.retrieve();
                        this.toast.add({ severity: "success", summary: "Thành công", detail: "Xóa độc giả thành công.", life: 3000 });
                    } catch (error) {
                        console.log(error);
                        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể xóa độc giả.", life: 3000 });
                    }
                },
            });
        },
        xoaViPham(dg) {
            this.confirm.require({
                message: `Xóa vi phạm cho độc giả "${dg.HoLot} ${dg.Ten}"?`,
                header: "Xác nhận",
                icon: "pi pi-exclamation-triangle",
                acceptLabel: "Đồng ý",
                rejectLabel: "Hủy",
                accept: async () => {
                    try {
                        await DocGiaService.xoaViPham(dg._id);
                        await this.retrieve();
                        this.toast.add({ severity: "success", summary: "Thành công", detail: "Xóa vi phạm thành công.", life: 3000 });
                    } catch (error) {
                        console.log(error);
                        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể xóa vi phạm.", life: 3000 });
                    }
                },
            });
        },
    },
    mounted() {
        this.retrieve();
    },
    watch: {
        "$route.query.cam"() { this.retrieve(); },
    },
};
</script>

<template>
  <div class="page-container">
    <div class="list-header">
      <h2>Độc giả</h2>
      <div class="list-actions">
        <InputSearch v-model="searchText" @submit="retrieve" />
      </div>
    </div>

    <DataTable
      :value="docgias"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="MaDocGia"
      :sortOrder="1"
      emptyMessage="Không có độc giả nào."
    >
      <Column field="index" header="STT">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="MaDocGia" header="Mã độc giả" sortable />
      <Column header="Họ tên" sortable field="HoLot">
        <template #body="slotProps">
          {{ slotProps.data.HoLot }} {{ slotProps.data.Ten }}
        </template>
      </Column>
      <Column field="Phai" header="Giới tính">
        <template #body="slotProps">
          {{ slotProps.data.Phai === "Nu" ? "Nữ" : slotProps.data.Phai }}
        </template>
      </Column>
      <Column header="Ngày sinh">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.NgaySinh) }}
        </template>
      </Column>
      <Column field="DienThoai" header="Điện thoại" />
      <Column header="Vi phạm">
        <template #body="slotProps">
          <Tag :severity="viPhamSeverity(slotProps.data.SoLanViPham || 0)" :value="viPhamLabel(slotProps.data.SoLanViPham || 0)" />
        </template>
      </Column>
      <Column header="Thao tác" style="width: 200px">
        <template #body="slotProps">
          <Button v-if="isQuanLy" icon="pi pi-trash" class="p-button-danger p-button-sm mr-1" @click="removeDocGia(slotProps.data)" />
          <Button icon="pi pi-check-circle" class="p-button-info p-button-sm" :disabled="!(slotProps.data.SoLanViPham > 0)" @click="xoaViPham(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.list-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}
</style>

