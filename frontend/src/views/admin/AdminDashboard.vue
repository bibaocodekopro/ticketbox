<script setup></script>

<template>
  <div class="admin-page">
    <a-page-header
      title="Trang quản trị"
      sub-title="Quản lý vé và hệ thống TicketBox"
    />

    <a-card class="mt-16" bordered>
      <p>
        Đây là khu vực dành cho quản trị viên. Bạn có thể di chuyển phần giao
        diện quản lý vé chi tiết vào đây sau.
      </p>
    </a-card>
  </div>
</template>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
}

.mt-16 {
  margin-top: 16px;
}
</style>
