<template>
  <div class="page-wide">
    <h4>
      Nhà xuất bản
      <i class="fas fa-building"></i>
    </h4>

    <div class="row mb-3">
      <div class="col-md-8">
        <InputSearch v-model="searchText" @submit="retrieveNxbs" />
      </div>
      <div class="col-md-4 text-right">
        <router-link :to="{ name: 'nhaxuatban.add' }" class="btn btn-success">
          <i class="fas fa-plus"></i> Thêm mới
        </router-link>
      </div>
    </div>

    <table v-if="nxbs.length > 0" class="table table-bordered table-hover">
      <thead class="thead-light">
        <tr>
          <th>#</th>
          <th>Mã NXB</th>
          <th>Tên nhà xuất bản</th>
          <th>Địa chỉ</th>
          <th style="width: 160px">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(nxb, index) in nxbs" :key="nxb._id">
          <td>{{ index + 1 }}</td>
          <td>{{ nxb.MaNXB }}</td>
          <td>{{ nxb.TenNXB }}</td>
          <td>{{ nxb.DiaChi }}</td>
          <td>
            <router-link
              :to="{ name: 'nhaxuatban.edit', params: { id: nxb._id } }"
              class="btn btn-sm btn-warning"
            >
              <i class="fas fa-edit"></i> Sửa
            </router-link>
            <button class="ml-1 btn btn-sm btn-danger" @click="removeNxb(nxb)">
              <i class="fas fa-trash"></i> Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Không có nhà xuất bản nào.</p>
  </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  components: { InputSearch },
  data() {
    return {
      nxbs: [],
      searchText: "",
    };
  },
  methods: {
    async retrieveNxbs() {
      try {
        this.nxbs = await NhaXuatBanService.getAll(this.searchText);
      } catch (error) {
        console.log(error);
      }
    },
    async removeNxb(nxb) {
      if (confirm(`Bạn muốn xóa nhà xuất bản "${nxb.TenNXB}"?`)) {
        try {
          await NhaXuatBanService.delete(nxb._id);
          this.retrieveNxbs();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  mounted() {
    this.retrieveNxbs();
  },
};
</script>

<style scoped>
.page-wide {
  text-align: left;
  max-width: 900px;
}
</style>