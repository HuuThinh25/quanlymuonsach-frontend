<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand">Quản lý mượn sách</router-link>
    <div class="mr-auto navbar-nav">
      <li class="nav-item">
        <router-link :to="{ name: 'nhaxuatban.list' }" class="nav-link">
          Nhà xuất bản
          <i class="fas fa-building"></i>
        </router-link>
      </li>
    </div>
  </nav>
</template>