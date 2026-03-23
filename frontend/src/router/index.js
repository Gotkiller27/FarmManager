import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AgentLayout from "@/layouts/AgentLayout.vue";

import Dashboard from "@/views/Dashboard.vue";
import Managers from "@/views/Managers.vue";
import Agents from "@/views/Agents.vue";
import Users from "@/views/Users.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

const routes = [
  {
    path: "/admin-dashboard",
    component: AdminLayout,
    children: [
      { path: "/", name: "dashboard", component: Dashboard },
      { path: "/managers", name: "managers", component: Managers },
      { path: "/agents", name: "agents", component: Agents },
      { path: "/users", name: "users", component: Users },
    ],
  },
  {
    path: "/agent",
    component: AgentLayout,
    children: [
      { path: "", name: "agent-dashboard", component: Dashboard },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginView
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});