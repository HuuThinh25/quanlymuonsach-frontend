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
        path: "/",
        component: () => import("@/layouts/ReaderLayout.vue"),
        meta: { requiresAuth: true, role: "docgia" },
        children: [
            {
                path: "",
                name: "reader.home",
                component: () => import("@/views/ReaderHome.vue"),
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
                component: () => import("@/views/AdminHome.vue"),
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

router.beforeEach((to, from, next) => {
    const loggedIn = authService.isLoggedIn();
    const role = authService.getRole();
    const validRoles = ["nhanvien", "docgia"];

    // Trang cần đăng nhập mà chưa có session
    if (to.meta.requiresAuth && !loggedIn) {
        return next("/login");
    }

    // Vai trò thiếu hoặc không hợp lệ → xóa session, chuyển /login nếu cần đăng nhập
    if (loggedIn && !validRoles.includes(role)) {
        authService.logout();
        if (to.meta.requiresAuth) {
            return next("/login");
        }
        return next();
    }

    // Đã đăng nhập mà vào /login → chuyển trang chủ theo vai trò
    if (to.meta.guest && loggedIn) {
        const target = authService.homeOf(role);
        if (to.path !== target) {
            return next(target);
        }
        return next();
    }

    // Có meta.role mà vai trò không khớp → chuyển trang chủ của vai trò đó
    // (nếu trang chủ đó chính là trang đang đến thì không chuyển nữa)
    if (to.meta.requiresAuth && to.meta.role && role !== to.meta.role) {
        const target = authService.homeOf(role);
        if (to.path !== target) {
            return next(target);
        }
        return next();
    }

    return next();
});

export default router;