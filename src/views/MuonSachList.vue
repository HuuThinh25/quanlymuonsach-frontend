<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import SelectButton from "primevue/selectbutton";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import MuonSachService from "@/services/muonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

function formatDate(iso) {
    if (!iso) return "-";
    const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return "-";
    return `${m[3]}/${m[2]}/${m[1]}`;
}

function isOverdue(phieu) {
    if (phieu.TrangThai !== "DangMuon" || !phieu.HanTra) return false;
    return new Date() > new Date(phieu.HanTra);
}

function daysOverdue(phieu) {
    if (!isOverdue(phieu)) return 0;
    const diff = new Date().getTime() - new Date(phieu.HanTra).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default {
    components: { DataTable, Column, Button, Tag, SelectButton, Dialog, Select, InputText },
    data() {
        return {
            phieus: [],
            loading: false,
            filter: "ChoDuyet",
            filterOptions: [
                { label: "Tất cả", value: "TatCa" },
                { label: "Chờ duyệt", value: "ChoDuyet" },
                { label: "Đang mượn", value: "DangMuon" },
                { label: "Quá hạn", value: "QuaHan" },
                { label: "Đã trả", value: "DaTra" },
                { label: "Từ chối", value: "TuChoi" },
            ],
            // Dialog ghi trả
            traDialog: false,
            traPhieu: null,
            traTinhTrang: "BinhThuong",
            traLoading: false,
            // Dialog lập phiếu
            lapDialog: false,
            lapLoading: false,
            lapMaDocGia: null,
            lapMaSach: null,
            docgiaList: [],
            sachList: [],
        };
    },
    computed: {
        docgiaOptions() {
            return this.docgiaList.map((d) => ({ label: `${d.MaDocGia} - ${d.HoLot} ${d.Ten}`, value: d.MaDocGia }));
        },
        sachOptions() {
            return this.sachList.map((s) => ({
                label: `${s.MaSach} - ${s.TenSach} (còn ${s.SoQuyenCon})`,
                value: s.MaSach,
                disabled: s.SoQuyenCon <= 0,
            }));
        },
        traOverdueDays() {
            if (!this.traPhieu) return 0;
            return daysOverdue(this.traPhieu);
        },
    },
    setup() {
        return { toast: useToast(), confirm: useConfirm() };
    },
    methods: {
        formatDate,
        isOverdue,
        async retrieve() {
            this.loading = true;
            try {
                const params = {};
                if (this.filter === "ChoDuyet") params.trangthai = "ChoDuyet";
                else if (this.filter === "DangMuon") params.trangthai = "DangMuon";
                else if (this.filter === "DaTra") params.trangthai = "DaTra";
                else if (this.filter === "TuChoi") params.trangthai = "TuChoi";
                else if (this.filter === "QuaHan") params.quahan = true;
                this.phieus = await MuonSachService.getAll(params);
            } catch (error) {
                console.log(error);
                this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể tải danh sách.", life: 3000 });
            } finally {
                this.loading = false;
            }
        },
        trangThaiLabel(tt, phieu) {
            if (tt === "ChoDuyet") return "Chờ duyệt";
            if (tt === "DangMuon") {
                return isOverdue(phieu) ? "Quá hạn" : "Đang mượn";
            }
            if (tt === "DaTra") return "Đã trả";
            if (tt === "TuChoi") return "Từ chối";
            return tt;
        },
        trangThaiSeverity(tt, phieu) {
            if (tt === "ChoDuyet") return "warn";
            if (tt === "DangMuon") {
                return isOverdue(phieu) ? "danger" : "info";
            }
            if (tt === "DaTra") return "success";
            if (tt === "TuChoi") return "secondary";
            return "secondary";
        },
        viPhamLabel(v) {
            if (v === "QuaHan") return "Quá hạn";
            if (v === "HuHong") return "Hư hỏng";
            return "-";
        },
        duyetPhieu(phieu) {
            this.confirm.require({
                message: `Duyệt phiếu mượn của độc giả ${phieu.MaDocGia}?`,
                header: "Xác nhận duyệt",
                icon: "pi pi-check",
                acceptLabel: "Duyệt",
                rejectLabel: "Hủy",
                accept: async () => {
                    try {
                        await MuonSachService.duyet(phieu._id);
                        await this.retrieve();
                        this.toast.add({ severity: "success", summary: "Thành công", detail: "Duyệt phiếu mượn thành công.", life: 3000 });
                    } catch (error) {
                        console.log(error);
                        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể duyệt phiếu.", life: 3000 });
                    }
                },
            });
        },
        tuChoiPhieu(phieu) {
            this.confirm.require({
                message: `Từ chối phiếu mượn của độc giả ${phieu.MaDocGia}?`,
                header: "Xác nhận từ chối",
                icon: "pi pi-times",
                acceptLabel: "Từ chối",
                rejectLabel: "Hủy",
                accept: async () => {
                    try {
                        await MuonSachService.tuChoi(phieu._id);
                        await this.retrieve();
                        this.toast.add({ severity: "success", summary: "Thành công", detail: "Từ chối phiếu mượn thành công.", life: 3000 });
                    } catch (error) {
                        console.log(error);
                        this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể từ chối phiếu.", life: 3000 });
                    }
                },
            });
        },
        openTraDialog(phieu) {
            this.traPhieu = phieu;
            this.traTinhTrang = "BinhThuong";
            this.traDialog = true;
        },
        async confirmTra() {
            if (!this.traPhieu) return;
            this.traLoading = true;
            try {
                const res = await MuonSachService.tra(this.traPhieu._id, this.traTinhTrang);
                this.traDialog = false;
                await this.retrieve();
                this.toast.add({ severity: "success", summary: "Thành công", detail: "Ghi trả sách thành công.", life: 3000 });
                if (res && res.viPham) {
                    const msg = res.soLanViPham != null
                        ? `Độc giả ${this.traPhieu.MaDocGia} hiện có ${res.soLanViPham}/3 dấu vi phạm.`
                        : "Độc giả bị ghi 1 dấu vi phạm.";
                    this.toast.add({ severity: "warn", summary: "Vi phạm", detail: msg, life: 5000 });
                }
            } catch (error) {
                console.log(error);
                this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể ghi trả sách.", life: 3000 });
            } finally {
                this.traLoading = false;
            }
        },
        async openLapDialog() {
            this.lapMaDocGia = null;
            this.lapMaSach = null;
            try {
                const [dg, sach] = await Promise.all([DocGiaService.getAll(), SachService.getAll({})]);
                this.docgiaList = dg;
                this.sachList = sach;
            } catch (error) {
                console.log(error);
            }
            this.lapDialog = true;
        },
        async confirmLap() {
            if (!this.lapMaDocGia || !this.lapMaSach) {
                this.toast.add({ severity: "warn", summary: "Thiếu thông tin", detail: "Vui lòng chọn độc giả và sách.", life: 3000 });
                return;
            }
            this.lapLoading = true;
            try {
                await MuonSachService.lapPhieu(this.lapMaDocGia, this.lapMaSach);
                this.lapDialog = false;
                await this.retrieve();
                this.toast.add({ severity: "success", summary: "Thành công", detail: "Lập phiếu mượn thành công.", life: 3000 });
            } catch (error) {
                console.log(error);
                this.toast.add({ severity: "error", summary: "Lỗi", detail: error.response?.data?.message || "Không thể lập phiếu mượn.", life: 4000 });
            } finally {
                this.lapLoading = false;
            }
        },
    },
    mounted() {
        if (this.$route.query.trangThai) {
            const t = this.$route.query.trangThai;
            if (t === "ChoDuyet") this.filter = "ChoDuyet";
            else if (t === "DangMuon") this.filter = "DangMuon";
            else if (t === "QuaHan") this.filter = "QuaHan";
        }
        this.retrieve();
    },
    watch: {
        "$route.query.trangThai"(v) {
            if (v === "ChoDuyet") this.filter = "ChoDuyet";
            else if (v === "DangMuon") this.filter = "DangMuon";
            else if (v === "QuaHan") this.filter = "QuaHan";
            this.retrieve();
        },
    },
    watch: {
        filter() {
            this.retrieve();
        },
    },
};
</script>

<template>
  <div class="page-container">
    <div class="list-header">
      <h2>Mượn / Trả sách</h2>
      <div class="list-actions">
        <SelectButton v-model="filter" :options="filterOptions" optionLabel="label" optionValue="value" />
        <Button label="Làm mới" icon="pi pi-refresh" severity="secondary" @click="retrieve" :disabled="loading" />
        <Button label="Lập phiếu mượn" icon="pi pi-plus" @click="openLapDialog" />
      </div>
    </div>

    <DataTable
      :value="phieus"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      sortField="_id"
      :sortOrder="-1"
      emptyMessage="Không có phiếu mượn nào."
    >
      <Column field="index" header="STT">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column header="Độc giả">
        <template #body="slotProps">
          <div>{{ slotProps.data.MaDocGia }}</div>
          <small>{{ slotProps.data.HoLot }} {{ slotProps.data.Ten }}</small>
        </template>
      </Column>
      <Column header="Sách">
        <template #body="slotProps">
          <div>{{ slotProps.data.MaSach }}</div>
          <small>{{ slotProps.data.TenSach }}</small>
        </template>
      </Column>
      <Column header="Ngày yêu cầu">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.NgayYeuCau) }}
        </template>
      </Column>
      <Column header="Ngày mượn">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.NgayMuon) }}
        </template>
      </Column>
      <Column header="Hạn trả">
        <template #body="slotProps">
          <span :class="{ 'text-danger font-bold': isOverdue(slotProps.data) }">
            {{ formatDate(slotProps.data.HanTra) }}
          </span>
        </template>
      </Column>
      <Column header="Ngày trả">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.NgayTra) }}
        </template>
      </Column>
      <Column header="Trạng thái">
        <template #body="slotProps">
          <Tag :severity="trangThaiSeverity(slotProps.data.TrangThai, slotProps.data)" :value="trangThaiLabel(slotProps.data.TrangThai, slotProps.data)" />
        </template>
      </Column>
      <Column header="Vi phạm">
        <template #body="slotProps">
          <Tag v-if="slotProps.data.ViPham" severity="danger" :value="viPhamLabel(slotProps.data.ViPham)" />
          <span v-else>-</span>
        </template>
      </Column>
      <Column header="Thao tác" style="width: 200px">
        <template #body="slotProps">
          <template v-if="slotProps.data.TrangThai === 'ChoDuyet'">
            <Button label="Duyệt" icon="pi pi-check" class="p-button-success p-button-sm mr-1" @click="duyetPhieu(slotProps.data)" :disabled="loading" />
            <Button label="Từ chối" icon="pi pi-times" class="p-button-secondary p-button-sm" @click="tuChoiPhieu(slotProps.data)" :disabled="loading" />
          </template>
          <template v-else-if="slotProps.data.TrangThai === 'DangMuon'">
            <Button label="Ghi trả" icon="pi pi-undo" class="p-button-info p-button-sm" @click="openTraDialog(slotProps.data)" :disabled="loading" />
          </template>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog ghi trả -->
    <Dialog v-model:visible="traDialog" header="Ghi trả sách" :modal="true" :style="{ width: '420px' }">
      <div class="dialog-body">
        <p><strong>Độc giả:</strong> {{ traPhieu?.MaDocGia }} - {{ traPhieu?.HoLot }} {{ traPhieu?.Ten }}</p>
        <p><strong>Sách:</strong> {{ traPhieu?.MaSach }} - {{ traPhieu?.TenSach }}</p>
        <div class="field">
          <label>Tình trạng sách</label>
          <SelectButton v-model="traTinhTrang" :options="[{ label: 'Bình thường', value: 'BinhThuong' }, { label: 'Hỏng', value: 'Hong' }]" optionLabel="label" optionValue="value" />
        </div>
        <div v-if="traOverdueDays > 0" class="warn-text">
          Phiếu đã trễ hạn {{ traOverdueDays }} ngày, độc giả sẽ bị ghi 1 dấu vi phạm.
        </div>
        <div v-if="traTinhTrang === 'Hong'" class="warn-text">
          Sách hỏng sẽ bị ghi 1 dấu vi phạm.
        </div>
      </div>
      <template #footer>
        <Button label="Hủy" icon="pi pi-times" severity="secondary" @click="traDialog = false" :disabled="traLoading" />
        <Button label="Xác nhận" icon="pi pi-check" @click="confirmTra" :loading="traLoading" />
      </template>
    </Dialog>

    <!-- Dialog lập phiếu mượn trực tiếp -->
    <Dialog v-model:visible="lapDialog" header="Lập phiếu mượn trực tiếp" :modal="true" :style="{ width: '460px' }">
      <div class="dialog-body">
        <div class="field">
          <label>Độc giả</label>
          <Select v-model="lapMaDocGia" :options="docgiaOptions" optionLabel="label" optionValue="value" filter placeholder="Chọn độc giả" class="w-full" />
        </div>
        <div class="field">
          <label>Sách</label>
          <Select v-model="lapMaSach" :options="sachOptions" optionLabel="label" optionValue="value" filter placeholder="Chọn sách" class="w-full">
            <template #option="slotProps">
              <span :class="{ 'text-disabled': slotProps.option.disabled }">{{ slotProps.option.label }}</span>
            </template>
          </Select>
        </div>
      </div>
      <template #footer>
        <Button label="Hủy" icon="pi pi-times" severity="secondary" @click="lapDialog = false" :disabled="lapLoading" />
        <Button label="Lập phiếu" icon="pi pi-check" @click="confirmLap" :loading="lapLoading" />
      </template>
    </Dialog>
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
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.field label {
  font-weight: 600;
}
.warn-text {
  color: #d32f2f;
  font-size: 0.9rem;
}
.text-danger {
  color: #d32f2f;
}
.font-bold {
  font-weight: 700;
}
.text-disabled {
  color: #999;
}
.w-full {
  width: 100%;
}
</style>
