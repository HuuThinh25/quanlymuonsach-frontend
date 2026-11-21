import createApiClient from "./api.service";

class DocGiaService {
    constructor(baseURL = "/api/docgia") {
        this.api = createApiClient(baseURL);
    }
    async getAll(params = {}) {
        const clean = {};
        if (typeof params === "string") {
            if (params) clean.name = params;
        } else {
            Object.keys(params).forEach((k) => {
                if (params[k] !== "" && params[k] !== null && params[k] !== undefined) clean[k] = params[k];
            });
        }
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
    async xoaViPham(id) {
        return (await this.api.put(`/${id}/xoa-vi-pham`)).data;
    }
}

export default new DocGiaService();
