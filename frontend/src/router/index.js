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
    path: "/", // On utilise la racine pour le layout principal
    component: AdminLayout,
    children: [
      // Ici, les paths doivent correspondre EXACTEMENT à ceux du sidebarItems
      { path: "dashboard", name: "dashboard", component: Dashboard }, 
      { path: "managers", name: "managers", component: Managers },
      { path: "agents", name: "agents", component: Agents },
      { path: "users", name: "users", component: Users },
      
      // Ajoute des routes vides ou vers Dashboard pour les départements en attendant
      { path: "departments/volaille", name: "volaille", component: Dashboard },
      { path: "departments/betail", name: "betail", component: Dashboard },
      { path: "departments/pisciculture", name: "pisciculture", component: Dashboard },
      { path: "my-campaigns", name: "campaigns", component: Dashboard },
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