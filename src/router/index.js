import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import MovieDetails from "../views/MovieDetails.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/movies/:id", component: MovieDetails, props: true }, // Dynamic route for movie details
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
