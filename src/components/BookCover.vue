<script>
import covers from "@/data/covers";

const COLORS = ["#42b883", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export default {
  props: { book: { type: Object, required: true } },
  data() {
    return { failed: false };
  },
  computed: {
    src() {
      if (this.failed) return "";
      if (this.book.AnhBia) return this.book.AnhBia;
      return covers[this.book.MaSach] || "";
    },
    initial() {
      const t = this.book.TenSach || "";
      return t.charAt(0).toUpperCase();
    },
    color() {
      const t = this.book.TenSach || "";
      let h = 0;
      for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
      return COLORS[h % COLORS.length];
    },
  },
};
</script>

<template>
  <div class="book-cover">
    <img v-if="src && !failed" :src="src" :alt="book.TenSach" loading="lazy" referrerpolicy="no-referrer" @error="onError" />
    <div v-else class="cover-fallback" :style="{ background: `linear-gradient(135deg, ${color}, #fff)` }">
      <i class="pi pi-book"></i>
      <span>{{ initial }}</span>
    </div>
  </div>
</template>

<style scoped>
.book-cover { height: 200px; overflow: hidden; border-radius: 8px 8px 0 0; background: #f3f4f6; }
.book-cover img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.cover-fallback { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-size: 2rem; gap: .25rem; }
.cover-fallback i { font-size: 2.5rem; }
</style>

