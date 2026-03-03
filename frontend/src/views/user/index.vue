<script setup>
const events = [
  {
    id: 1,
    title: "PSYCHIC FEVER First Fan Meeting in Vietnam",
    price: "From 990,000 VND",
    date: "March 05, 2026",
    image: "https://picsum.photos/600/300?random=1",
  },
  {
    id: 2,
    title: "Spring Concert | Opening Season",
    price: "From 650,000 VND",
    date: "March 14, 2026",
    image: "https://picsum.photos/600/300?random=2",
  },
  {
    id: 3,
    title: "Special Live Show - Thuy Dung",
    price: "From 400,000 VND",
    date: "March 13, 2026",
    image: "https://picsum.photos/600/300?random=3",
  },
  {
    id: 4,
    title: "Minh Tuyet & Mai Tien Dung Night",
    price: "From 500,000 VND",
    date: "March 06, 2026",
    image: "https://picsum.photos/600/300?random=4",
  },
];
</script>

<template>
  <div class="home-container">
    <h2 class="section-title">Live Music</h2>

    <div class="event-scroll">
      <div class="event-card" v-for="event in events" :key="event.id">
        <img :src="event.image" class="event-image" />

        <div class="event-content">
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-price">{{ event.price }}</p>
          <p class="event-date">
            <calendar-outlined />
            {{ event.date }}
          </p>
        </div>
      </div>
    </div>

    <h2 class="section-title">Stage & Art</h2>

    <div class="event-scroll">
      <div class="event-card" v-for="event in events" :key="'art-' + event.id">
        <img :src="event.image" class="event-image" />
        <div class="event-content">
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-price">{{ event.price }}</p>
          <p class="event-date">
            <calendar-outlined />
            {{ event.date }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
}

.section-title {
  color: white;
  margin-bottom: 16px;
  font-size: 20px;
}

.event-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.event-scroll::-webkit-scrollbar {
  height: 6px;
}

.event-scroll::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.event-card {
  min-width: 320px;
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
}

.event-card:hover {
  transform: translateY(-5px);
}

.event-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.event-content {
  padding: 12px;
}

.event-title {
  color: white;
  font-size: 15px;
  margin-bottom: 8px;
}

.event-price {
  color: #22c55e;
  font-weight: bold;
  margin-bottom: 6px;
}

.event-date {
  color: #cbd5e1;
  font-size: 13px;
}
</style>