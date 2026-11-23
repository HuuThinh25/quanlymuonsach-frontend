import { createWebHistory, createRouter } from "vue-router";
import authService from "@/services/auth.service";

const routes = [
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginView.vue"),
        meta: { guest: true },
    },
    {
        path: "/dang-ky",
        name: "register",
        component: () => import("@/views/RegisterView.vue"),
        meta: { guest: true },
    },
    {
        path: "/quen-mat-khau",
        name: "forgot",
        component: () => import("@/views/QuenMatKhauView.vue"),
        meta: { guest: true },
    },
    {
        path: "/dat-lai-mat-khau",
        name: "reset",
        component: () => import("@/views/DatLaiMatKhauView.vue"),
        meta: { guest: true },
    },
    {
        path: "/",
        component: () => import("@/layouts/ReaderLayout.vue"),
        children: [
            {
                path: "",
                name: "reader.home",
                component: () => import("@/views/ReaderHome.vue"),
            },
            {
                path: "lich-su-muon",
                name: "reader.history",
                component: () => import("@/views/LichSuMuon.vue"),
                meta: { requiresAuth: true, role: "docgia" },
            },
            {
                path: "ho-so",
                name: "reader.profile",
                component: () => import("@/views/ReaderProfile.vue"),
                meta: { requiresAuth: true, role: "docgia" },
            },
        ],
    },
    {
        path: "/admin",
        component: () => import("@/layouts/AdminLayout.vue"),
        meta: { requiresAuth: true, role: "nhanvien" },
        children: [
            {
                path: "",
                name: "admin.home",
                component: () => import("@/views/AdminDashboard.vue"),
            },
            {
                path: "muonsach",
                name: "muonsach.list",
                component: () => import("@/views/MuonSachList.vue"),
            },
            {
                path: "nhaxuatban",
                name: "nhaxuatban.list",
                component: () => import("@/views/NhaXuatBanList.vue"),
            },
            {
                path: "nhaxuatban/add",
                name: "nhaxuatban.add",
                component: () => import("@/views/NhaXuatBanAdd.vue"),
            },
            {
                path: "nhaxuatban/:id",
                name: "nhaxuatban.edit",
                component: () => import("@/views/NhaXuatBanEdit.vue"),
                props: true,
            },
            {
                path: "sach",
                name: "sach.list",
                component: () => import("@/views/SachList.vue"),
            },
            {
                path: "sach/add",
                name: "sach.add",
                component: () => import("@/views/SachAdd.vue"),
            },
            {
                path: "sach/:id",
                name: "sach.edit",
                component: () => import("@/views/SachEdit.vue"),
                props: true,
            },
            {
                path: "docgia",
                name: "docgia.list",
                component: () => import("@/views/DocGiaList.vue"),
            },
            {
                path: "nhanvien",
                name: "nhanvien.list",
                component: () => import("@/views/NhanVienList.vue"),
                meta: { chucVu: "QuanLy" },
            },
            {
                path: "nhanvien/add",
                name: "nhanvien.add",
                component: () => import("@/views/NhanVienAdd.vue"),
                meta: { chucVu: "QuanLy" },
            },
            {
                path: "nhanvien/:id",
                name: "nhanvien.edit",
                component: () => import("@/views/NhanVienEdit.vue"),
                props: true,
                meta: { chucVu: "QuanLy" },
            },
            {
                path: "ho-so",
                name: "admin.profile",
                component: () => import("@/views/AdminProfile.vue"),
            },
        ],
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

router.beforeEach((to) => {
    const loggedIn = authService.isLoggedIn();
    const role = authService.getRole();
    const validRoles = ["nhanvien", "docgia"];

    // Guest pages accessible when not logged in
    const guestPaths = ["/login", "/dang-ky", "/quen-mat-khau", "/dat-lai-mat-khau"];
    if (guestPaths.includes(to.path) && !loggedIn) {
        return;
    }

    // Already logged in visiting login/register → redirect to home by role
    if (loggedIn && (to.path === "/login" || to.path === "/dang-ky")) {
        return authService.homeOf(role);
    }

    // Requires auth
    if (to.meta.requiresAuth && !loggedIn) {
        return "/login";
    }

    // Invalid role
    if (loggedIn && !validRoles.includes(role)) {
        authService.logout();
        if (to.meta.requiresAuth) return "/login";
        return;
    }

    // Role mismatch
    if (to.meta.requiresAuth && to.meta.role && role !== to.meta.role) {
        return authService.homeOf(role);
    }

    // chucVu guard for nhanvien
    if (to.meta.chucVu) {
        const user = authService.getUser();
        if (user?.ChucVu !== to.meta.chucVu) {
            return "/admin";
        }
    }

    return;
});

export default router;

