<script>
import * as yup from "yup";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Button from "primevue/button";
import NhaXuatBanService from "@/services/nhaxuatban.service";

const currentYear = new Date().getFullYear();

const schema = yup.object().shape({
  MaSach: yup.string().required("Mã sách phải có giá trị.").max(20, "Mã sách tối đa 20 ký tự."),
  TenSach: yup.string().required("Tên sách phải có giá trị.").max(200, "Tên sách tối đa 200 ký tự."),
  MaNXB: yup.string().required("Nhà xuất bản phải có giá trị."),
  DonGia: yup.number().typeError("Đơn giá phải là số.").min(0, "Đơn giá >= 0.").required("Đơn giá không được để trống."),
  SoQuyen: yup.number().typeError("Số quyển phải là số.").integer("Số quyển phải là số nguyên.").min(0, "Số quyển >= 0.").required("Số quyển không được để trống."),
  NamXuatBan: yup
    .number()
    .transform((v, o) => (o === "" || o === null || o === undefined ? undefined : v))
    .notRequired()
    .typeError("Năm xuất bản phải là số.")
    .min(1000, "Năm xuất bản từ 1000.")
    .max(currentYear, `Năm xuất bản đến ${currentYear}.`),
});

export default {
  components: { InputText, InputNumber, Select, Button },
  emits: ["submit:sach"],
  props: {
    sach: { type: Object, required: true },
  },
  data() {
    return {
      sachLocal: { ...this.sach },
      nxbList: [],
      errors: {},
    };
  },
  async created() {
    try {
      this.nxbList = await NhaXuatBanService.getAll();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    async validateAndSubmit() {
      this.errors = {};
      // Không gửi SoQuyenCon lên server
      const { SoQuyenCon, ...payload } = this.sachLocal;
      try {
        await schema.validate(payload, { abortEarly: false });
      } catch (err) {
        if (err.inner) {
          err.inner.forEach((e) => {
            if (e.path && !this.errors[e.path]) {
              this.errors[e.path] = e.message;
            }
          });
        }
        return;
      }
      this.$emit("submit:sach", payload);
    },
    cancel() {
      this.$router.push({ name: "sach.list" });
    },
  },
};
</script>

<template>
  <form @submit.prevent="validateAndSubmit" class="sach-form">
    <div class="form-field">
      <label for="MaSach">Mã sách</label>
      <InputText id="MaSach" v-model="sachLocal.MaSach" :disabled="!!sachLocal._id" class="w-full" />
      <small v-if="errors.MaSach" class="error-text">{{ errors.MaSach }}</small>
    </div>

    <div class="form-field">
      <label for="TenSach">Tên sách</label>
      <InputText id="TenSach" v-model="sachLocal.TenSach" class="w-full" />
      <small v-if="errors.TenSach" class="error-text">{{ errors.TenSach }}</small>
    </div>

    <div class="form-field">
      <label for="NguonGocTacGia">Tác giả / Nguồn gốc</label>
      <InputText id="NguonGocTacGia" v-model="sachLocal.NguonGocTacGia" class="w-full" />
    </div>

    <div class="form-field">
      <label for="TheLoai">Thể loại</label>
      <InputText id="TheLoai" v-model="sachLocal.TheLoai" class="w-full" />
    </div>

    <div class="form-field">
      <label for="NamXuatBan">Năm xuất bản</label>
      <InputNumber id="NamXuatBan" v-model="sachLocal.NamXuatBan" :useGrouping="false" class="w-full" />
      <small v-if="errors.NamXuatBan" class="error-text">{{ errors.NamXuatBan }}</small>
    </div>

    <div class="form-field">
      <label for="DonGia">Đơn giá</label>
      <InputNumber id="DonGia" v-model="sachLocal.DonGia" mode="currency" currency="VND" locale="vi-VN" class="w-full" />
      <small v-if="errors.DonGia" class="error-text">{{ errors.DonGia }}</small>
    </div>

    <div class="form-field">
      <label for="SoQuyen">Số quyển</label>
      <InputNumber id="SoQuyen" v-model="sachLocal.SoQuyen" :minFractionDigits="0" :maxFractionDigits="0" class="w-full" />
      <small v-if="errors.SoQuyen" class="error-text">{{ errors.SoQuyen }}</small>
    </div>

    <div class="form-field" v-if="sachLocal._id">
      <label>Số quyển còn</label>
      <InputText :value="sachLocal.SoQuyenCon" disabled class="w-full" />
    </div>

    <div class="form-field">
      <label for="MaNXB">Nhà xuất bản</label>
      <Select
        id="MaNXB"
        v-model="sachLocal.MaNXB"
        :options="nxbList"
        optionLabel="TenNXB"
        optionValue="MaNXB"
        placeholder="Chọn nhà xuất bản"
        class="w-full"
      />
      <small v-if="errors.MaNXB" class="error-text">{{ errors.MaNXB }}</small>
    </div>

    <div class="form-actions">
      <Button type="submit" label="Lưu" icon="pi pi-check" />
      <Button type="button" label="Thoát" icon="pi pi-times" severity="secondary" @click="cancel" />
    </div>
  </form>
</template>

<style scoped>
.sach-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.form-field label {
  font-weight: 600;
}
.error-text {
  color: #d32f2f;
  font-size: 0.8rem;
}
.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.w-full {
  width: 100%;
}
</style>

