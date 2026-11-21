import createApiClient from "./api.service";

class MuonSachService {
    constructor(baseURL = "/api/muonsach") {
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
    async lapPhieu(MaDocGia, MaSach) {
        return (await this.api.post("/", { MaDocGia, MaSach })).data;
    }
    async duyet(id) {
        return (await this.api.put(`/${id}/duyet`)).data;
    }
    async tuChoi(id) {
        return (await this.api.put(`/${id}/tu-choi`)).data;
    }
    async tra(id, TinhTrangSach) {
        return (await this.api.put(`/${id}/tra`, { TinhTrangSach })).data;
    }
}

export default new MuonSachService();
