import { createRouter, createWebHistory } from "vue-router";

import UserLayout from "../layouts/UserLayout.vue";
import UserHome from "../views/user/index.vue";
import MyTickets from "../views/user/MyTickets.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import Login from "../views/user/Login.vue";
import Register from "../views/user/Register.vue";
const routes = [
  {
    path: "/",
    component: UserLayout,
    children: [
      {
        path: "",
        name: "UserHome",
        component: UserHome,
      },
      {
        path: "my-tickets",
        name: "UserMyTickets",
        component: MyTickets,
      },
      {
        path: "login",
        name: "Login",
        component: Login,
      },
      {
        path: "register",
        name: "Register",
        component: Register,
      },
    ],
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

