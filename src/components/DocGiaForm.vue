<script>
import * as yup from "yup";
import InputText from "primevue/inputtext";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import Password from "primevue/password";
import Button from "primevue/button";
import authService from "@/services/auth.service";

const phoneRegex = /^(09|03|07|08|05)[0-9]{8}$/;

function parseIsoDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatLocalDate(d) {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

const schema = yup.object().shape({
    MaDocGia: yup.string().required("Mã độc giả không được để trống.").max(20, "Mã độc giả tối đa 20 ký tự."),
    HoLot: yup.string().required("Họ lót không được để trống."),
    Ten: yup.string().required("Tên không được để trống."),
    Phai: yup.string().oneOf(["Nam", "Nu"], "Giới tính phải là Nam hoặc Nu.").nullable(),
    DienThoai: yup
        .string()
        .transform((v) => (v === "" ? undefined : v))
        .notRequired()
        .test("phone", "Số điện thoại không hợp lệ.", (v) => !v || phoneRegex.test(v)),
});

export default {
    components: { InputText, DatePicker, Select, Password, Button },
    emits: ["submit:docgia"],
    props: {
        docgia: { type: Object, required: true },
    },
    data() {
        const local = { ...this.docgia };
        if (local.NgaySinh) {
            local.NgaySinh = parseIsoDate(local.NgaySinh);
        }
        return {
            docgiaLocal: local,
            errors: {},
            showPassword: false,
        };
    },
    computed: {
        isEdit() {
            return !!this.docgiaLocal._id;
        },
    },
    methods: {
        async validateAndSubmit() {
            this.errors = {};
            const payload = { ...this.docgiaLocal };
            // Chuyển ngày sinh sang chuỗi yyyy-MM-dd theo giờ địa phương
            if (payload.NgaySinh instanceof Date) {
                payload.NgaySinh = formatLocalDate(payload.NgaySinh);
            }
            // Khi sửa: nếu mật khẩu rỗng thì không gửi Password
            if (this.isEdit && (!payload.Password || payload.Password === "")) {
                delete payload.Password;
            }
            // Không gửi SoLanViPham
            delete payload.SoLanViPham;

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

            // Kiểm tra mật khẩu khi thêm
            if (!this.isEdit) {
                if (!payload.Password || payload.Password.length < 6) {
                    this.errors.Password = "Mật khẩu bắt buộc và phải có ít nhất 6 ký tự.";
                    return;
                }
            } else if (payload.Password && payload.Password.length > 0 && payload.Password.length < 6) {
                this.errors.Password = "Mật khẩu phải có ít nhất 6 ký tự.";
                return;
            }

            this.$emit("submit:docgia", payload);
        },
        cancel() {
            this.$router.push({ name: "docgia.list" });
        },
    },
};
</script>

<template>
  <form @submit.prevent="validateAndSubmit" class="docgia-form">
    <div class="form-field">
      <label for="MaDocGia">Mã độc giả</label>
      <InputText id="MaDocGia" v-model="docgiaLocal.MaDocGia" :disabled="!!docgiaLocal._id" class="w-full" />
      <small v-if="errors.MaDocGia" class="error-text">{{ errors.MaDocGia }}</small>
    </div>

    <div class="form-field">
      <label for="HoLot">Họ lót</label>
      <InputText id="HoLot" v-model="docgiaLocal.HoLot" class="w-full" />
      <small v-if="errors.HoLot" class="error-text">{{ errors.HoLot }}</small>
    </div>

    <div class="form-field">
      <label for="Ten">Tên</label>
      <InputText id="Ten" v-model="docgiaLocal.Ten" class="w-full" />
      <small v-if="errors.Ten" class="error-text">{{ errors.Ten }}</small>
    </div>

    <div class="form-field">
      <label for="NgaySinh">Ngày sinh</label>
      <DatePicker id="NgaySinh" v-model="docgiaLocal.NgaySinh" dateFormat="dd/mm/yy" class="w-full" />
    </div>

    <div class="form-field">
      <label for="Phai">Giới tính</label>
      <Select id="Phai" v-model="docgiaLocal.Phai" :options="['Nam', 'Nu']" placeholder="Chọn giới tính" class="w-full" />
      <small v-if="errors.Phai" class="error-text">{{ errors.Phai }}</small>
    </div>

    <div class="form-field">
      <label for="DiaChi">Địa chỉ</label>
      <InputText id="DiaChi" v-model="docgiaLocal.DiaChi" class="w-full" />
    </div>

    <div class="form-field">
      <label for="DienThoai">Điện thoại</label>
      <InputText id="DienThoai" v-model="docgiaLocal.DienThoai" class="w-full" />
      <small v-if="errors.DienThoai" class="error-text">{{ errors.DienThoai }}</small>
    </div>

    <div class="form-field">
      <label for="Password">Mật khẩu</label>
      <Password id="Password" v-model="docgiaLocal.Password" :feedback="false" toggleMask class="w-full" />
      <small v-if="isEdit" class="hint-text">Để trống nếu không đổi.</small>
      <small v-if="errors.Password" class="error-text">{{ errors.Password }}</small>
    </div>

    <div class="form-field" v-if="isEdit">
      <label>Số lần vi phạm</label>
      <InputText :value="`${docgiaLocal.SoLanViPham || 0}/3`" disabled class="w-full" />
    </div>

    <div class="form-actions">
      <Button type="submit" label="Lưu" icon="pi pi-check" />
      <Button type="button" label="Thoát" icon="pi pi-times" severity="secondary" @click="cancel" />
    </div>
  </form>
</template>

<style scoped>
.docgia-form {
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
