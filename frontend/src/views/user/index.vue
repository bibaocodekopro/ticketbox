<script setup>
import { computed, onMounted, ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import api from "@/api/axios";


const router = useRouter();
const venues = ref([]);
const events = ref([]);
const loading = ref(false);
const initialized = ref(false);
// Lưu ref cho từng thanh cuộn theo index venue
const scrollers = ref([]);
const setScrollerRef = (index, el) => {
  if (el) {
    scrollers.value[index] = el;
  }
};


const goDetail = (id) => router.push(`/events/${id}`);

const fetchVenue = async () => {
  loading.value = true;
  initialized.value = false;

  try {
    const res = await api.get("/venues");

    // Lưu tạm
    const venueData = res.data;

    const venuesHasEvent = venueData.filter(v => v.eventCount > 0);

    // Load batch đầu tiên
    await Promise.all(
      venuesHasEvent.map(v => loadEvents(v.id))
    );

    // Sau khi load xong event rồi mới set venues
    venues.value = venueData;

    initialized.value = true;

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const venueEvents = reactive({});
const loadEvents = async (venueId) => {
  if (!venueEvents[venueId]) {
    venueEvents[venueId] = {
      events: [],
      offset: 0,
      loading: false,
      hasMore: true
    };
  }

  const state = venueEvents[venueId];

  if (state.loading || !state.hasMore) return;

  state.loading = true;

  const res = await api.get(`/venues/${venueId}/events`, {
    params: {
      limit: 5,
      offset: state.offset
    }
  });

  const newEvents = res.data;

  if (newEvents.length < 5) {
    state.hasMore = false;
  }

  state.events.push(...newEvents);
  state.offset += 5;
  state.loading = false;
};
const filteredVenues = computed(() => {
  return venues.value.filter(v => v && v.eventCount > 0);
});

const handleScroll = (venueId, el) => {
  if (!venueEvents[venueId]) return;

  const state = venueEvents[venueId];

  // Nếu đang loading hoặc hết dữ liệu thì không làm gì
  if (state.loading || !state.hasMore) return;

  const scrollLeft = el.scrollLeft;
  const clientWidth = el.clientWidth;
  const scrollWidth = el.scrollWidth;

  // Nếu scroll gần tới cuối (cách 50px)
  if (scrollLeft + clientWidth >= scrollWidth - 50) {
    loadEvents(venueId);
  }
};

onMounted(fetchVenue);

</script>

<template>
  <div class="home">
    <a-card class="hero" :bordered="false">
      <div class="hero-title">Discover events</div>
      <div class="hero-sub">
        Book tickets quickly, follow your favorite events, and manage your
        tickets.
      </div>
    </a-card>

    <a-spin :spinning="loading">
      <template v-if="initialized">
        <div v-for="(group, index) in filteredVenues" :key="group.id" class="venue-section">
          <div class="venue-header">
            <div class="venue-title">{{ group.name }}</div>
          </div>
          <div class="event-scroll" :ref="(el) => setScrollerRef(index, el)"
            @scroll="(e) => handleScroll(group.id, e.target)">
            <!-- Loading lần đầu -->
            <a-spin v-if="!venueEvents[group.id]" />

            <!-- Event list -->
            <template v-else>
              <div v-for="e in venueEvents[group.id].events" :key="e.id" class="event-card-wrapper">
                <a-card hoverable class="event-card" :body-style="{ padding: '12px' }" @click="goDetail(e.id)">
                  <template #cover>
                    <img class="cover" :src="e.image" :alt="e.title" />
                  </template>

                  <a-space direction="vertical" size="small" style="width: 100%">
                    <div class="title">{{ e.title }}</div>
                  </a-space>
                </a-card>
              </div>

              <!-- Loading khi scroll load thêm -->
              <div v-if="venueEvents[group.id].loading" class="scroll-loading">
                <a-spin size="small" />
              </div>
            </template>
          </div>
        </div>
      </template>
    </a-spin>
  </div>
</template>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* HERO */
.hero {
  border-radius: 28px;
  padding: 48px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #9333ea);
  color: white;
  box-shadow: 0 30px 60px rgba(124, 58, 237, 0.35);
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: "";
  position: absolute;
  right: -80px;
  top: -80px;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.hero-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
}

.hero-sub {
  margin-top: 12px;
  font-size: 16px;
  opacity: 0.9;
}

/* SECTION */
.venue-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.venue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.venue-title {
  font-size: 22px;
  font-weight: 700;
  position: relative;
  padding-left: 14px;
}

.venue-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 18px;
  background: #4f46e5;
  border-radius: 4px;
}

/* SCROLL */
.event-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 12px;
  scroll-behavior: smooth;
}

.event-scroll::-webkit-scrollbar {
  height: 6px;
}

.event-scroll::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.6);
  border-radius: 999px;
}

/* CARD WRAPPER */
.event-card-wrapper {
  min-width: 280px;
  flex: 0 0 auto;
}

/* CARD */
.event-card {
  border-radius: 22px;
  overflow: hidden;
  border: none;
  transition: all 0.35s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
}

/* IMAGE */
.cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.event-card:hover .cover {
  transform: scale(1.08);
}

/* TITLE */
.title {
  font-weight: 700;
  font-size: 16px;
  line-height: 1.4;
  min-height: 44px;
}

/* LOADING SCROLL */
.scroll-loading {
  display: flex;
  align-items: center;
  padding: 0 20px;
}

/* MOBILE */
@media (max-width: 768px) {
  .home {
    padding: 16px;
  }

  .hero {
    padding: 28px;
  }

  .hero-title {
    font-size: 24px;
  }

  .cover {
    height: 200px;
  }
}
</style>