<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";

export default {
  components: { InputText, Button },
  props: {
    modelValue: { type: String, default: "" },
  },
  emits: ["submit", "update:modelValue"],
  methods: {
    updateModelValue(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    submit() {
      this.$emit("submit");
    },
  },
};
</script>

<template>
  <div class="input-search">
    <InputText
      :value="modelValue"
      @input="updateModelValue"
      @keyup.enter="submit"
      placeholder="Nhập thông tin cần tìm"
    />
    <Button label="Tìm kiếm" icon="pi pi-search" @click="submit" />
  </div>
</template>

<style scoped>
.input-search {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.input-search :deep(.p-inputtext) {
  flex: 1;
}
</style>

