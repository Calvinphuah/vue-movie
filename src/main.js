import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import App from "./App.vue";
import router from "./router";
import Ripple from "primevue/ripple";
import "./assets/main.css";
import "./style.css";

// ✅ Import PrimeVue components that are frequently used globally
import Menubar from "primevue/menubar";
import Badge from "primevue/badge";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Button from "primevue/button";
import Tag from "primevue/tag";
import ProgressBar from "primevue/progressbar";
import Checkbox from "primevue/checkbox";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import DatePicker from "primevue/datepicker";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// ✅ Register PrimeVue components globally if used frequently
app.component("Menubar", Menubar);
app.component("Badge", Badge);
app.component("InputText", InputText);
app.component("Avatar", Avatar);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.component("Button", Button);
app.component("Tag", Tag);
app.component("ProgressBar", ProgressBar);
app.component("Checkbox", Checkbox);
app.component("MultiSelect", MultiSelect);
app.component("Dropdown", Dropdown);
app.component("Dialog", Dialog);
app.component("InputNumber", InputNumber);
app.component("DatePicker", DatePicker);
app.component("Toast", Toast);

// ✅ Enable Ripple directive globally
app.directive("ripple", Ripple);
app.use(ToastService);

app.use(router);
app.mount("#app");
