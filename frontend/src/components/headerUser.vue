<template>
  <a-layout-header class="header">
    <div class="header-inner">
      <div class="left-section">
        <div class="logo" @click="router.push('/')">TicketBox</div>

        <input v-model="searchValue" type="text" placeholder="Search..." class="custom-search" />
      </div>

      <!-- Menu cho Desktop -->
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" class="right-menu desktop-menu"
        @click="handleMenuClick">
        <!-- Khi chưa đăng nhập -->
        <template v-if="!isAuthenticated">
          <a-menu-item key="login"> Login </a-menu-item>
        </template>

        <!-- Khi đã đăng nhập -->
        <a-sub-menu v-else key="profile" class="profile-menu">
          <template #title>
            <a-space>
              <a-avatar size="small" :style="{ backgroundColor: '#1677ff' }">
                {{ user?.email?.charAt(0).toUpperCase() }}
              </a-avatar>
              <span class="user-email">{{ user?.email?.split("@")[0] }}</span>
            </a-space>
          </template>
          <a-menu-item key="my-tickets">
            <ShoppingCartOutlined /> My tickets
          </a-menu-item>

          <a-menu-item key="profile">
            <UserOutlined /> Profile
          </a-menu-item>
          <a-menu-item key="logout" @click="handleLogout">
            <LogoutOutlined /> Logout
          </a-menu-item>
        </a-sub-menu>
      </a-menu>

      <!-- Menu cho Mobile -->
      <a-dropdown class="mobile-menu" placement="bottomRight">
        <a-button type="text" class="mobile-menu-btn">
          <MenuOutlined style="color: white; font-size: 20px; margin: auto" />
        </a-button>

        <template #overlay>
          <a-menu @click="handleMenuClick">
            <template v-if="!isAuthenticated">
              <a-menu-divider />
              <a-menu-item key="login">Login</a-menu-item>
            </template>

            <template v-else>
              <a-menu-item key="my-tickets">
                <ShoppingCartOutlined /> My tickets
              </a-menu-item>
              <a-menu-item key="profile">
                <UserOutlined /> Profile
              </a-menu-item>
              <a-menu-item key="logout" @click="handleLogout">
                <LogoutOutlined /> Logout
              </a-menu-item>
            </template>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const { user, isAuthenticated, logout } = useAuth();

const selectedKeys = ref(["home"]);
const searchValue = ref("");

watch(
  () => route.path,
  (path) => {
    if (path === "/") selectedKeys.value = ["home"];
    else if (path === "/my-tickets") selectedKeys.value = ["my-tickets"];
    else if (path === "/profile") selectedKeys.value = ["profile"];
  },
  { immediate: true },
);

const handleMenuClick = ({ key }) => {
  if (key === "home") router.push("/");
  else if (key === "my-tickets") router.push("/my-tickets");
  else if (key === "profile") router.push("/profile");
  else if (key === "login") router.push("/login");
};

const handleLogout = async () => {
  try {
    logout();
    message.success("Logout successful!");
    router.push("/");
  } catch (err) {
    message.error("Something went wrong!");
  }
};

// Lắng nghe sự kiện login từ các component khác
onMounted(() => {
  window.addEventListener("auth-change", () => {
    // Refresh auth state
    useAuth().checkAuth();
  });
});
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  padding: 0 32px;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-inner {
  width: 100%;
  height: 68px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LEFT SECTION */
.left-section {
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1px;

  background: linear-gradient(90deg, #4f46e5, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  cursor: pointer;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

/* SEARCH */
.search-input {
  width: 340px;
}

.search-input :deep(.ant-input-affix-wrapper) {
  border-radius: 999px !important;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.search-input :deep(.ant-input-affix-wrapper:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.search-input :deep(.ant-input-affix-wrapper-focused) {
  border: 1px solid #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.25);
}

.search-input :deep(input) {
  background: transparent;
  color: white;
}

.search-input :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

/* MENU */
.right-menu {
  background: transparent !important;
  border-bottom: none !important;
}

.right-menu :deep(.ant-menu-item),
.right-menu :deep(.ant-menu-submenu-title) {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease;
  font-weight: 500;
}

.right-menu :deep(.ant-menu-item:hover),
.right-menu :deep(.ant-menu-submenu-title:hover) {
  color: #a78bfa !important;
}

.right-menu :deep(.ant-menu-item-selected) {
  color: #4f46e5 !important;
  background: transparent !important;
  border-bottom: none !important;
  color: white !important;
}

/* PROFILE */
.profile-menu :deep(.ant-menu-submenu-title) {
  display: flex;
  align-items: center;
  padding: 0 14px;
}

.user-email {
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-menu :deep(.ant-menu-submenu-arrow) {
  color: rgba(255, 255, 255, 0.6);
}

/* AVATAR */
:deep(.ant-avatar) {
  background: linear-gradient(135deg, #4f46e5, #9333ea) !important;
  font-weight: 600;
}

/* DROPDOWN */
:deep(.ant-dropdown-menu) {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 8px;
}

:deep(.ant-dropdown-menu-item) {
  color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.ant-dropdown-menu-item:hover) {
  background: rgba(79, 70, 229, 0.2) !important;
  color: #a78bfa !important;
}

:deep(.ant-dropdown-menu-item-divider) {
  background-color: rgba(255, 255, 255, 0.08);
}

/* MOBILE */
.desktop-menu {
  display: flex;
}

.mobile-menu {
  display: none;
}

.custom-search {
  width: 300px;
  height: 35px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  outline: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.custom-search::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.custom-search:hover {
  background: rgba(255, 255, 255, 0.08);
}

.custom-search:focus {
  border: 1px solid #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25);
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .header-inner {
    height: 60px;
  }

  .left-section {
    gap: 14px;
  }

  .logo {
    font-size: 18px;
  }

  .search-input {
    width: 180px;
  }

  .desktop-menu {
    display: none;
  }

  .mobile-menu {
    display: block;
  }

  .mobile-menu-btn {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    transition: all 0.3s ease;
    display: flex;
    padding: 0;
  }

  .mobile-menu-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
