import api from "./api.service";

const VALID_ROLES = ["nhanvien", "docgia"];

export default {
    async login(role, ma, password) {
        const response = await api("/api").post("/auth/login", { role, ma, password });
        const { token, user } = response.data;
        const userWithRole = { ...user, role };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userWithRole));
        return { token, user: userWithRole };
    },
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
    getUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },
    getRole() {
        const role = this.getUser()?.role;
        return VALID_ROLES.includes(role) ? role : null;
    },
    getToken() {
        return localStorage.getItem("token");
    },
    isLoggedIn() {
        return !!localStorage.getItem("token");
    },
    homeOf(role) {
        return role === "nhanvien" ? "/admin" : "/";
    },
};