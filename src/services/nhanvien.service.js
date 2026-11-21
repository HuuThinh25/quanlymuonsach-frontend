import createApiClient from "./api.service";

class NhanVienService {
    constructor(baseURL = "/api/nhanvien") {
        this.api = createApiClient(baseURL);
    }
    async getAll(name) {
        const params = name ? { name } : {};
        return (await this.api.get("/", { params })).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new NhanVienService();
