import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AgGridVue } from "ag-grid-vue3";

const app = createApp(App);

app.use(router);
app.component("ag-grid-vue", AgGridVue);
app.mount("#app");
