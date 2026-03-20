import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AgentLayout from "@/layouts/AgentLayout.vue";

import Dashboard from "@/views/Dashboard.vue";
import Managers from "@/views/Managers.vue";
import Agents from "@/views/Agents.vue";
import Users from "@/views/Users.vue";

const routes = [
  {
    path: "/",
    component: AdminLayout,
    children: [
      { path: "", name: "dashboard", component: Dashboard },
      { path: "managers", name: "managers", component: Managers },
      { path: "agents", name: "agents", component: Agents },
      { path: "users", name: "users", component: Users },
    ],
  },
  {
    path: "/agent",
    component: AgentLayout,
    children: [
      { path: "", name: "agent-dashboard", component: Dashboard },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});