<script>
import * as yup from "yup";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const schema = yup.object().shape({
  MaNXB: yup.string().required("Mã NXB phải có giá trị.").max(20, "Mã NXB tối đa 20 ký tự."),
  TenNXB: yup.string().required("Tên NXB phải có giá trị.").max(100, "Tên NXB tối đa 100 ký tự."),
  DiaChi: yup.string().max(200, "Địa chỉ tối đa 200 ký tự."),
});

export default {
  components: { InputText, Button },
  emits: ["submit:nxb"],
  props: {
    nxb: { type: Object, required: true },
  },
  data() {
    return {
      nxbLocal: { ...this.nxb },
      errors: {},
    };
  },
  methods: {
    async validateAndSubmit() {
      this.errors = {};
      try {
        await schema.validate(this.nxbLocal, { abortEarly: false });
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
      this.$emit("submit:nxb", this.nxbLocal);
    },
    cancel() {
      this.$router.push({ name: "nhaxuatban.list" });
    },
  },
};
</script>

<template>
  <form @submit.prevent="validateAndSubmit" class="nxb-form">
    <div class="form-field">
      <label for="MaNXB">Mã NXB</label>
      <InputText
        id="MaNXB"
        v-model="nxbLocal.MaNXB"
        :disabled="!!nxbLocal._id"
        class="w-full"
      />
      <small v-if="errors.MaNXB" class="error-text">{{ errors.MaNXB }}</small>
    </div>

    <div class="form-field">
      <label for="TenNXB">Tên nhà xuất bản</label>
      <InputText id="TenNXB" v-model="nxbLocal.TenNXB" class="w-full" />
      <small v-if="errors.TenNXB" class="error-text">{{ errors.TenNXB }}</small>
    </div>

    <div class="form-field">
      <label for="DiaChi">Địa chỉ</label>
      <InputText id="DiaChi" v-model="nxbLocal.DiaChi" class="w-full" />
      <small v-if="errors.DiaChi" class="error-text">{{ errors.DiaChi }}</small>
    </div>

    <div class="form-actions">
      <Button type="submit" label="Lưu" icon="pi pi-check" />
      <Button type="button" label="Thoát" icon="pi pi-times" severity="secondary" @click="cancel" />
    </div>
  </form>
</template>

<style scoped>
.nxb-form {
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
