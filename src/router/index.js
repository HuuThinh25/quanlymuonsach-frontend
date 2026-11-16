import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/",
        redirect: { name: "nhaxuatban.list" },
    },
    {
        path: "/nhaxuatban",
        name: "nhaxuatban.list",
        component: () => import("@/views/NhaXuatBanList.vue"),
    },
    {
        path: "/nhaxuatban/add",
        name: "nhaxuatban.add",
        component: () => import("@/views/NhaXuatBanAdd.vue"),
    },
    {
        path: "/nhaxuatban/:id",
        name: "nhaxuatban.edit",
        component: () => import("@/views/NhaXuatBanEdit.vue"),
        props: true,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;