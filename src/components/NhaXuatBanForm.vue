<template>
  <Form @submit="submitNxb" :validation-schema="schema">
    <div class="form-group">
      <label for="MaNXB">Mã NXB</label>
      <Field
        id="MaNXB"
        name="MaNXB"
        type="text"
        class="form-control"
        :disabled="!!nxbLocal._id"
        v-model="nxbLocal.MaNXB"
      />
      <ErrorMessage name="MaNXB" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="TenNXB">Tên nhà xuất bản</label>
      <Field
        id="TenNXB"
        name="TenNXB"
        type="text"
        class="form-control"
        v-model="nxbLocal.TenNXB"
      />
      <ErrorMessage name="TenNXB" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="DiaChi">Địa chỉ</label>
      <Field
        id="DiaChi"
        name="DiaChi"
        type="text"
        class="form-control"
        v-model="nxbLocal.DiaChi"
      />
      <ErrorMessage name="DiaChi" class="error-feedback" />
    </div>

    <div class="form-group">
      <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu</button>
      <button type="button" class="ml-2 btn btn-secondary" @click="cancel">
        Thoát
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:nxb"],
  props: {
    nxb: { type: Object, required: true },
  },
  data() {
    const schema = yup.object().shape({
      MaNXB: yup
        .string()
        .required("Mã NXB phải có giá trị.")
        .max(20, "Mã NXB tối đa 20 ký tự."),
      TenNXB: yup
        .string()
        .required("Tên NXB phải có giá trị.")
        .max(100, "Tên NXB tối đa 100 ký tự."),
      DiaChi: yup.string().max(200, "Địa chỉ tối đa 200 ký tự."),
    });
    return {
      // Bản sao cục bộ để không sửa trực tiếp props
      nxbLocal: { ...this.nxb },
      schema,
    };
  },
  methods: {
    submitNxb() {
      this.$emit("submit:nxb", this.nxbLocal);
    },
    cancel() {
      this.$router.push({ name: "nhaxuatban.list" });
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>