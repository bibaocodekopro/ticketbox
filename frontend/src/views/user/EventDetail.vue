<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuth } from "@/composables/useAuth";
import { message } from "ant-design-vue";

const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();

const event = ref(null);
const loading = ref(false);

const eventId = computed(() => Number(route.params.id));

const dateText = computed(() => {
  if (!event.value?.date) return "-";
  const d = new Date(event.value.date);
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
});

const priceText = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

const tierColumns = [
  { title: "Hạng vé", dataIndex: "name" },
  {
    title: "Giá",
    dataIndex: "price",
    customRender: ({ value }) => priceText(value),
  },
  { title: "Còn lại", dataIndex: "available" },
];

const handleBuy = () => {
  if (!event.value) return;
  if (!isAuthenticated.value) {
    router.push({ path: "/login", query: { redirect: route.fullPath } });
    return;
  }
  message.info("Chức năng mua vé sẽ được nối backend sau.");
};

const fetchEvent = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/events/${eventId.value}`);
    event.value = res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      event.value = null;
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEvent);
</script>

<template>
  <div v-if="loading">
    <a-spin />
  </div>

  <div v-else-if="!event">
    <a-result
      status="404"
      title="Không tìm thấy sự kiện"
      sub-title="Sự kiện không tồn tại hoặc đã bị gỡ."
    >
      <template #extra>
        <a-button type="primary" @click="$router.push('/')">
          Về trang chủ
        </a-button>
      </template>
    </a-result>
  </div>

  <div v-else class="detail">
    <a-breadcrumb>
      <a-breadcrumb-item>
        <router-link to="/">Trang chủ</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>Chi tiết sự kiện</a-breadcrumb-item>
    </a-breadcrumb>

    <a-card class="hero" :body-style="{ padding: 0 }" bordered>
      <img class="cover" :src="event.cover" :alt="event.title" />
      <div class="hero-body">
        <a-space direction="vertical" size="small" style="width: 100%">
          <a-tag color="geekblue">{{ event.category }}</a-tag>
          <div class="title">{{ event.title }}</div>
          <div class="meta">
            <span>{{ dateText }}</span>
            <span>•</span>
            <span>{{ event.venue }}, {{ event.city }}</span>
          </div>
          <div class="actions">
            <a-button type="primary" size="large" @click="handleBuy">
              Mua vé
            </a-button>
            <a-button size="large" @click="$router.back()">Quay lại</a-button>
          </div>
        </a-space>
      </div>
    </a-card>

    <a-row :gutter="16" class="mt-16">
      <a-col :xs="24" :lg="14">
        <a-card title="Giới thiệu" bordered>
          <p class="desc">{{ event.description }}</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="10">
        <a-card title="Thông tin" bordered>
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="Thời gian">
              {{ dateText }}
            </a-descriptions-item>
            <a-descriptions-item label="Địa điểm">
              {{ event.venue }}, {{ event.city }}
            </a-descriptions-item>
            <a-descriptions-item label="Giá từ">
              {{ priceText(event.priceFrom) }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="mt-16" title="Bảng giá vé" bordered>
      <a-table
        :columns="tierColumns"
        :data-source="event.ticketTiers"
        row-key="name"
        size="small"
        :pagination="false"
      />
    </a-card>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mt-16 {
  margin-top: 16px;
}

.hero {
  overflow: hidden;
  border-radius: 14px;
}

.cover {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
}

.hero-body {
  padding: 16px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
}

.meta {
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.desc {
  margin: 0;
}

@media (max-width: 768px) {
  .cover {
    height: 220px;
  }
}
</style>

