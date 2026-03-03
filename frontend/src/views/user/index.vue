<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";

const router = useRouter();
const category = ref("All");
const events = ref([]);
const loading = ref(false);

const categories = computed(() => {
  const set = new Set(
    events.value
      .map((e) => e.category)
      .filter(Boolean),
  );
  return ["All", ...Array.from(set)];
});

const filteredEvents = computed(() => {
  if (category.value === "All") return events.value;
  return events.value.filter((e) => e.category === category.value);
});

const priceText = (v) => {
  if (v == null) return "Đang cập nhật";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
};

const dateText = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
};

const goDetail = (id) => router.push(`/events/${id}`);

const fetchEvents = async () => {
  loading.value = true;
  try {
    const res = await api.get("/events");
    events.value = res.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEvents);
</script>

<template>
  <div class="home">
    <a-card class="hero" :bordered="false">
      <div class="hero-title">Discover events</div>
      <div class="hero-sub">
        Book tickets quickly, follow your favorite events, and manage your tickets.
      </div>
    </a-card>

    <a-space class="mt-16" wrap>
      <a-segmented v-model:value="category" :options="categories" />
    </a-space>

    <a-row :gutter="[16, 16]" class="mt-16">
      <a-col
        v-for="e in filteredEvents"
        :key="e.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <a-card
          hoverable
          class="event-card"
          :body-style="{ padding: '12px' }"
          @click="goDetail(e.id)"
        >
          <template #cover>
            <img class="cover" :src="e.cover" :alt="e.title" />
          </template>

          <a-space direction="vertical" size="small" style="width: 100%">
            <a-tag color="geekblue">{{ e.category }}</a-tag>
            <div class="title">{{ e.title }}</div>
            <div class="meta">
              <span>{{ dateText(e.date) }}</span>
              <span>•</span>
              <span>{{ e.city }}</span>
            </div>
            <div class="price">Từ {{ priceText(e.priceFrom) }}</div>
            <a-button type="primary" block @click.stop="goDetail(e.id)">
              Xem chi tiết
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* HERO */
.hero {
  border-radius: 20px;
  padding: 32px;
  background: linear-gradient(
    135deg,
    #4f46e5,
    #7c3aed,
    #9333ea
  );
  color: white;
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.25);
}

.hero-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.hero-sub {
  margin-top: 8px;
  opacity: 0.9;
  font-size: 15px;
}

/* CARD */
.event-card {
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

/* IMAGE */
.cover {
  width: 100%;
  height: 170px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.event-card:hover .cover {
  transform: scale(1.05);
}

/* TITLE */
.title {
  font-weight: 700;
  font-size: 15px;
  line-height: 1.4;
  min-height: 44px;
}

/* META */
.meta {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.55);
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* PRICE */
.price {
  font-weight: 800;
  font-size: 16px;
  color: #4f46e5;
}

/* BUTTON */
:deep(.ant-btn-primary) {
  border-radius: 10px;
  font-weight: 600;
  height: 38px;
}

/* CATEGORY SEGMENT */
:deep(.ant-segmented) {
  background: #f3f4f6;
  padding: 4px;
  border-radius: 999px;
}

:deep(.ant-segmented-item-selected) {
  background: white;
  border-radius: 999px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .cover {
    height: 200px;
  }

  .hero {
    padding: 24px;
  }

  .hero-title {
    font-size: 22px;
  }
}
</style>