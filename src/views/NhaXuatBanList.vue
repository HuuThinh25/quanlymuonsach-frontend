<!--
Mẫu chuẩn cho bảng khác (PrimeVue):
- Components: DataTable, Column, Button, InputText, Toast, ConfirmDialog (đăng ký global qua main.js).
- Service: getAll(name?) trả list; delete(id) xóa; create/update cho Add/Edit.
- List: DataTable :value, :loading, paginator (rows=10), sortField/sortOrder, emptyMessage.
- Tìm kiếm: InputSearch emit submit → gọi service.getAll(searchText) (lọc ở server qua ?name=).
- Xóa: this.$confirm.require({ message, header, accept }) → service.delete(id) → reload + Toast success;
  lỗi server hiện Toast error với error.response?.data?.message.
- Thêm/Sửa: Card bọc form, Form emit submit:nxb, yup validate thủ công, Toast thành công/lỗi.
-->
<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputSearch from "@/components/InputSearch.vue";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

export default {
  components: { DataTable, Column, Button, InputSearch },
  data() {
    return {
      nxbs: [],
      searchText: "",
      loading: false,
    };
  },
  setup() {
    return {
      toast: useToast(),
      confirm: useConfirm(),
    };
  },
  methods: {
    async retrieveNxbs() {
      this.loading = true;
      try {
        this.nxbs = await NhaXuatBanService.getAll(this.searchText);
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
    removeNxb(nxb) {
      this.confirm.require({
        message: `Bạn muốn xóa nhà xuất bản "${nxb.TenNXB}"?`,
        header: "Xác nhận xóa",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Xóa",
        rejectLabel: "Hủy",
        accept: async () => {
          try {
            await NhaXuatBanService.delete(nxb._id);
            await this.retrieveNxbs();
            this.toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Xóa nhà xuất bản thành công.",
              life: 3000,
            });
          } catch (error) {
            console.log(error);
            this.toast.add({
              severity: "error",
              summary: "Lỗi",
              detail: error.response?.data?.message || "Không thể xóa nhà xuất bản.",
              life: 3000,
            });
          }
        },
      });
    },
  },
  mounted() {
    this.retrieveNxbs();
  },
};
</script>

<template>
  <div class="page-container">
    <div class="list-header">
      <h2>Nhà xuất bản</h2>
      <div class="list-actions">
        <InputSearch v-model="searchText" @submit="retrieveNxbs" />
        <Button label="Thêm mới" icon="pi pi-plus" @click="$router.push({ name: 'nhaxuatban.add' })" />
      </div>
    </div>

    <DataTable
      :value="nxbs"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="MaNXB"
      :sortOrder="1"
      emptyMessage="Không có nhà xuất bản nào."
    >
      <Column field="index" header="STT" :sortable="false">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="MaNXB" header="Mã NXB" sortable />
      <Column field="TenNXB" header="Tên nhà xuất bản" sortable />
      <Column field="DiaChi" header="Địa chỉ" />
      <Column header="Thao tác" style="width: 160px">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-warn p-button-sm mr-1"
            @click="$router.push({ name: 'nhaxuatban.edit', params: { id: slotProps.data._id } })"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            @click="removeNxb(slotProps.data)"
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

