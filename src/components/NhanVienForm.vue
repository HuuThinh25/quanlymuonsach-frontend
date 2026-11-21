<script>
import * as yup from "yup";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Select from "primevue/select";

const phoneRegex = /^(09|03|07|08|05)[0-9]{8}$/;

const schema = yup.object().shape({
    MSNV: yup.string().required("Phải có mã nhân viên").max(20, "MSNV tối đa 20 ký tự."),
    HoTenNV: yup.string().required("Phải ghi rõ họ tên nhân viên"),
    SoDienThoai: yup
        .string()
        .transform((v) => (v === "" ? undefined : v))
        .notRequired()
        .test("phone", "Số điện thoại không hợp lệ.", (v) => !v || phoneRegex.test(v)),
});

export default {
    components: { InputText, Password, Button, Select },
    emits: ["submit:nhanvien"],
    props: {
        nhanvien: { type: Object, required: true },
    },
    data() {
        return {
            nhanvienLocal: { ...this.nhanvien },
            errors: {},
        };
    },
    computed: {
        isEdit() {
            return !!this.nhanvienLocal._id;
        },
    },
    methods: {
        async validateAndSubmit() {
            this.errors = {};
            const payload = { ...this.nhanvienLocal };
            if (this.isEdit && (!payload.Password || payload.Password === "")) {
                delete payload.Password;
            }
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
            if (!this.isEdit) {
                if (!payload.Password || payload.Password.length < 6) {
                    this.errors.Password = "Mật khẩu bắt buộc và phải có ít nhất 6 ký tự.";
                    return;
                }
            } else if (payload.Password && payload.Password.length > 0 && payload.Password.length < 6) {
                this.errors.Password = "Mật khẩu phải có ít nhất 6 ký tự.";
                return;
            }
            this.$emit("submit:nhanvien", payload);
        },
        cancel() {
            this.$router.push({ name: "nhanvien.list" });
        },
    },
};
</script>

<template>
  <form @submit.prevent="validateAndSubmit" class="nhanvien-form">
    <div class="form-field">
      <label for="MSNV">MSNV</label>
      <InputText id="MSNV" v-model="nhanvienLocal.MSNV" :disabled="!!nhanvienLocal._id" class="w-full" />
      <small v-if="errors.MSNV" class="error-text">{{ errors.MSNV }}</small>
    </div>

    <div class="form-field">
      <label for="HoTenNV">Họ tên</label>
      <InputText id="HoTenNV" v-model="nhanvienLocal.HoTenNV" class="w-full" />
      <small v-if="errors.HoTenNV" class="error-text">{{ errors.HoTenNV }}</small>
    </div>

    <div class="form-field">
      <label for="ChucVu">Chức vụ</label>
      <Select id="ChucVu" v-model="nhanvienLocal.ChucVu" :options="[{label:'QuanLy',value:'QuanLy'},{label:'NhanVien',value:'NhanVien'}]" optionLabel="label" optionValue="value" class="w-full" />
    </div>

    <div class="form-field">
      <label for="Email">Email</label>
      <InputText id="Email" v-model="nhanvienLocal.Email" class="w-full" />
    </div>

    <div class="form-field">
      <label for="DiaChi">Địa chỉ</label>
      <InputText id="DiaChi" v-model="nhanvienLocal.DiaChi" class="w-full" />
    </div>

    <div class="form-field">
      <label for="SoDienThoai">Số điện thoại</label>
      <InputText id="SoDienThoai" v-model="nhanvienLocal.SoDienThoai" class="w-full" />
      <small v-if="errors.SoDienThoai" class="error-text">{{ errors.SoDienThoai }}</small>
    </div>

    <div class="form-field">
      <label for="Password">Mật khẩu</label>
      <Password id="Password" v-model="nhanvienLocal.Password" :feedback="false" toggleMask class="w-full" />
      <small v-if="isEdit" class="hint-text">Để trống nếu không đổi.</small>
      <small v-if="errors.Password" class="error-text">{{ errors.Password }}</small>
    </div>

    <div class="form-actions">
      <Button type="submit" label="Lưu" icon="pi pi-check" />
      <Button type="button" label="Thoát" icon="pi pi-times" severity="secondary" @click="cancel" />
    </div>
  </form>
</template>

<style scoped>
.nhanvien-form {
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
.hint-text {
  color: #666;
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