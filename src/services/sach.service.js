import createApiClient from "./api.service";

class SachService {
    constructor(baseURL = "/api/sach") {
        this.api = createApiClient(baseURL);
    }
    async getAll(params = {}) {
        const clean = {};
        Object.keys(params).forEach((k) => {
            if (params[k] !== "" && params[k] !== null && params[k] !== undefined) {
                clean[k] = params[k];
            }
        });
        return (await this.api.get("/", { params: clean })).data;
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

export default new SachService();
