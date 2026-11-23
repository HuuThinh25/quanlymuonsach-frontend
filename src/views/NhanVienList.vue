<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputSearch from "@/components/InputSearch.vue";
import NhanVienService from "@/services/nhanvien.service";
import authService from "@/services/auth.service";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

export default {
    components: { DataTable, Column, Button, InputSearch },
    data() {
        return {
            nhanviens: [],
            searchText: "",
            loading: false,
        };
    },
    computed: {
        currentUser() {
            return authService.getUser();
        },
    },
    setup() {
        return { toast: useToast(), confirm: useConfirm() };
    },
    methods: {
        async retrieve() {
            this.loading = true;
            try {
                this.nhanviens = await NhanVienService.getAll(this.searchText);
            } catch (error) {
                console.log(error);
                this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể tải danh sách.", life: 3000 });
            } finally {
                this.loading = false;
            }
        },
        isSelf(nv) {
            const u = this.currentUser;
            return u && u._id && nv._id && String(u._id) === String(nv._id);
        },
        removeNhanVien(nv) {
            this.confirm.require({
                message: `Bạn muốn xóa nhân viên "${nv.HoTenNV}"?`,
                header: "Xác nhận xóa",
                icon: "pi pi-exclamation-triangle",
                acceptLabel: "Xóa",
                rejectLabel: "Hủy",
                accept: async () => {
                    try {
                        await NhanVienService.delete(nv._id);
                        await this.retrieve();
                        this.toast.add({ severity: "success", summary: "Thành công", detail: "Xóa nhân viên thành công.", life: 3000 });
                    } catch (error) {
                        console.log(error);
                        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể xóa nhân viên.", life: 3000 });
                    }
                },
            });
        },
    },
    mounted() {
        this.retrieve();
    },
};
</script>

<template>
  <div class="page-container">
    <div class="list-header">
      <h2>Nhân viên</h2>
      <div class="list-actions">
        <InputSearch v-model="searchText" @submit="retrieve" />
        <Button label="Thêm mới" icon="pi pi-plus" @click="$router.push({ name: 'nhanvien.add' })" />
      </div>
    </div>

    <DataTable
      :value="nhanviens"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="MSNV"
      :sortOrder="1"
      emptyMessage="Không có nhân viên nào."
    >
      <Column field="index" header="STT">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="MSNV" header="MSNV" sortable />
      <Column field="HoTenNV" header="Họ tên" sortable />
      <Column field="ChucVu" header="Chức vụ" />
      <Column field="SoDienThoai" header="Số điện thoại" />
      <Column header="Thao tác" style="width: 160px">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-warning p-button-sm mr-1"
            @click="$router.push({ name: 'nhanvien.edit', params: { id: slotProps.data._id } })"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            :disabled="isSelf(slotProps.data)"
            @click="removeNhanVien(slotProps.data)"
          />
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
