import axios from "axios"

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

export default (baseURL) => {
    const instance = axios.create({
        baseURL,
        ...commonConfig,
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                const url = error.config?.url || "";
                const isLoginRequest = url.includes("/api/auth/login");
                if (!isLoginRequest && window.location.pathname !== "/login") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};