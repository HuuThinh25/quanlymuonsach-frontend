<script>
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";

export default {
  components: {
    Toast,
    ConfirmDialog,
  },
};
</script>

<template>
  <Toast />
  <ConfirmDialog />
  <router-view />
</template>

<style>
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}
</style>

