<template>
  <div
    class="p-6 max-w-4xl mx-auto bg-gray-900 text-white rounded-lg shadow-md"
  >
    <!-- Back Button -->
    <Button
      class="p-button-text mb-4 flex items-center"
      icon="pi pi-arrow-left"
      @click="$router.push('/')"
      label="Back to Movies"
    />

    <!-- Movie Content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Movie Poster -->
      <div class="flex justify-center">
        <img
          v-if="movie.image_url"
          :src="movie.image_url"
          alt="Movie Poster"
          class="w-48 h-64 object-cover rounded-lg border border-gray-700 shadow-lg"
        />
        <div
          v-else
          class="w-48 h-64 bg-gray-800 flex items-center justify-center rounded-lg"
        >
          <span class="text-gray-500 italic">No Image</span>
        </div>
      </div>

      <!-- Movie Info -->
      <div class="md:col-span-2">
        <h1 class="text-3xl font-bold mb-2">{{ movie.title }}</h1>
        <p class="text-gray-400 mb-1">
          Directed by: <span class="text-white">{{ movie.director }}</span>
        </p>
        <p class="text-gray-400 mb-1">
          Released on: <span class="text-white">{{ movie.release_date }}</span>
        </p>

        <!-- Status Tag -->
        <Tag
          :value="movie.status"
          :severity="getStatusSeverity(movie.status)"
          class="mt-2"
        />

        <!-- Genres -->
        <div class="flex flex-wrap gap-2 mt-3">
          <Tag
            v-for="(genre, index) in movie.genres"
            :key="index"
            :value="genre"
            severity="info"
          />
        </div>

        <!-- Movie Score -->
        <p class="mt-4 text-gray-300">
          Score: <strong class="text-white">{{ movie.score }}%</strong>
        </p>

        <!-- Movie Description -->
        <p class="mt-4 text-gray-300">
          {{ movie.description || "No description available." }}
        </p>
      </div>
    </div>

    <!-- YouTube Trailer -->
    <div v-if="movie.trailer_url" class="mt-6">
      <h2 class="text-xl font-bold mb-3">Watch Trailer</h2>
      <div class="relative w-full aspect-video">
        <iframe
          class="absolute top-0 left-0 w-full h-full rounded-lg"
          :src="getEmbedUrl(movie.trailer_url)"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      movie: {},
    };
  },
  async mounted() {
    const movieId = this.$route.params.id;
    try {
      const response = await axios.get(
        `http://localhost:3000/movies/${movieId}`
      );
      this.movie = response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  },
  methods: {
    // Define the colors for movie status
    getStatusSeverity(status) {
      const statusColors = {
        Released: "success", // Green
        Upcoming: "warn", // Yellow
        Rumored: "danger", // Red
      };
      return statusColors[status] || "secondary"; // Default color
    },

    // Convert YouTube URL to Embed URL
    getEmbedUrl(url) {
      if (!url) return "";

      // Extract the video ID from YouTube URL
      const videoIdMatch = url.match(/(?:\/|v=|vi=)([a-zA-Z0-9_-]{11})/);

      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }

      return url; // If no match, return the original URL
    },
  },
};
</script>

<style>
.aspect-w-16 {
  aspect-ratio: 16 / 9;
}
</style>
