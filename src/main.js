import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import "primeicons/primeicons.css";
import "./assets/app.css";

const IndigoPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#42b883",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22",
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(PrimeVue, { theme: { preset: IndigoPreset, options: { darkModeSelector: false } } });
app.use(ToastService);
app.use(ConfirmationService);
app.directive("tooltip", Tooltip);
app.mount("#app");
