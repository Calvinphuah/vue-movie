<template>
  <div class="card pt-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      <span class="text-xl font-bold">Movies</span>
      <div class="flex gap-2">
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success"
          @click="openAddDialog"
        />
        <InputText
          v-model="searchQuery"
          placeholder="Search movies..."
          class="p-inputtext-sm"
        />
      </div>
    </div>

    <!-- Table -->
    <DataTable :value="filteredMovies" tableStyle="min-width: 50rem">
      <!-- Image Column (No Header) -->
      <Column>
        <template #body="{ data }">
          <img
            v-if="data.image_url"
            :src="data.image_url"
            alt="Movie Poster"
            class="w-12 h-16 object-cover rounded-lg"
          />
          <span v-else class="text-gray-400 italic">No Image</span>
        </template>
      </Column>

      <Column field="title" header="Title" sortable></Column>
      <Column field="director" header="Director" sortable></Column>

      <Column field="genres" header="Genres">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <Tag
              v-for="(genre, index) in data.genres"
              :key="index"
              :value="genre"
              class="p-tag-sm"
              severity="info"
            />
          </div>
        </template>
      </Column>

      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag
            :value="data.status"
            :severity="getStatusSeverity(data.status)"
          />
        </template>
      </Column>

      <Column field="release_date" header="Released Date" sortable></Column>

      <Column field="score" header="Score" sortable>
        <template #body="{ data }"> {{ data.score }}% </template>
      </Column>

      <!-- Actions (Edit & Delete) -->
      <Column header="Actions">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-warning mr-2"
            @click="openEditDialog(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="confirmDelete(data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Movie Dialog (For Add/Edit) -->
    <MovieDialog
      v-model:visible="movieDialog"
      :movieData="selectedMovie"
      @movie-saved="handleMovieSaved"
    />

    <!-- Confirm Delete Dialog -->
    <Dialog
      v-model:visible="deleteDialog"
      header="Confirm Deletion"
      :modal="true"
    >
      <p>
        Are you sure you want to delete
        <strong>{{ selectedMovie?.title }}</strong
        >?
      </p>
      <div class="flex justify-end gap-2 pt-6">
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="deleteDialog = false"
        />
        <Button
          label="Delete"
          icon="pi pi-check"
          class="p-button-danger"
          @click="deleteMovie"
        />
      </div>
    </Dialog>
  </div>
</template>

<script>
import axios from "axios";
import MovieDialog from "../components/MovieDialog.vue";

export default {
  components: {
    MovieDialog,
  },
  data() {
    return {
      movies: [],
      deleteDialog: false,
      movieDialog: false,
      selectedMovie: null,
      searchQuery: "",
    };
  },
  computed: {
    filteredMovies() {
      if (!this.searchQuery) return this.movies;
      const query = this.searchQuery.toLowerCase().trim();
      return this.movies.filter((movie) =>
        ["title", "director", "genres"].some((key) =>
          movie[key]?.toString().toLowerCase().includes(query)
        )
      );
    },
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get("http://localhost:3000/movies");
        this.movies = response.data;
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
    openAddDialog() {
      this.selectedMovie = null;
      this.movieDialog = true;
    },
    openEditDialog(movie) {
      this.selectedMovie = { ...movie };
      this.movieDialog = true;
    },
    confirmDelete(movie) {
      this.selectedMovie = movie;
      this.deleteDialog = true;
    },
    async deleteMovie() {
      if (!this.selectedMovie) return;
      try {
        await axios.delete(
          `http://localhost:3000/movies/${this.selectedMovie.id}`
        );
        this.movies = this.movies.filter((m) => m.id !== this.selectedMovie.id);
        this.deleteDialog = false;
        this.selectedMovie = null;
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    },
    handleMovieSaved(updatedMovie) {
      const index = this.movies.findIndex((m) => m.id === updatedMovie.id);
      if (index !== -1) {
        this.movies[index] = updatedMovie;
      } else {
        this.movies.push(updatedMovie);
      }
    },

    // To get the Status Color
    getStatusSeverity(status) {
      const statusColors = {
        Released: "success", // Green
        Upcoming: "warn", // Yellow
        Rumored: "danger", // Red
      };
      return statusColors[status] || "secondary"; // Default color
    },
  },
  mounted() {
    this.fetchMovies();
  },
};
</script>
