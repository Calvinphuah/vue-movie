<template>
  <Dialog
    :visible="visible"
    :header="isEditing ? 'Edit Movie' : 'Add New Movie'"
    :modal="true"
    :closable="true"
    class="w-full max-w-lg"
    @update:visible="$emit('update:visible', false)"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Title -->
      <div class="flex flex-col">
        <label for="title" class="font-semibold mb-1">Title</label>
        <InputText
          v-model="movie.title"
          placeholder="Enter movie title"
          class="p-inputtext-sm"
        />
        <small v-if="errors.title" class="text-red-500">{{
          errors.title
        }}</small>
      </div>

      <!-- Director -->
      <div class="flex flex-col">
        <label for="director" class="font-semibold mb-1">Director</label>
        <InputText
          v-model="movie.director"
          placeholder="Enter director's name"
          class="p-inputtext-sm"
        />
        <small v-if="errors.director" class="text-red-500">{{
          errors.director
        }}</small>
      </div>

      <!-- Genres -->
      <div class="flex flex-col sm:col-span-2">
        <label for="genres" class="font-semibold mb-1">Genres</label>
        <MultiSelect
          v-model="movie.genres"
          :options="genres"
          placeholder="Select a genre"
          class="p-dropdown-sm"
        />
        <small v-if="errors.genres" class="text-red-500">{{
          errors.genres
        }}</small>
      </div>

      <!-- Status -->
      <div class="flex flex-col">
        <label for="status" class="font-semibold mb-1">Status</label>
        <Dropdown
          v-model="movie.status"
          :options="statuses"
          placeholder="Select status"
          class="p-dropdown-sm"
        />
        <small v-if="errors.status" class="text-red-500">{{
          errors.status
        }}</small>
      </div>

      <!-- Release Date -->
      <div class="flex flex-col">
        <label for="release_date" class="font-semibold mb-1"
          >Release Date</label
        >
        <DatePicker
          v-model="movie.release_date"
          dateFormat="dd-mm-yy"
          placeholder="DD-MM-YYYY"
          class="p-calendar-sm"
        />
        <small v-if="errors.release_date" class="text-red-500">{{
          errors.release_date
        }}</small>
      </div>

      <!-- Score -->
      <div class="flex flex-col sm:col-span-2">
        <label for="score" class="font-semibold mb-1">Score</label>
        <InputNumber
          v-model="movie.score"
          :min="0"
          :max="100"
          suffix="%"
          placeholder="Enter a score (0-100)"
          class="p-inputnumber-sm w-full"
        />
        <small v-if="errors.score" class="text-red-500">{{
          errors.score
        }}</small>
      </div>

      <!-- Image URL -->
      <div class="flex flex-col sm:col-span-2">
        <label for="image_url" class="font-semibold mb-1">Image URL</label>
        <InputText
          v-model="movie.image_url"
          placeholder="Enter image URL"
          class="p-inputtext-sm"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-2 mt-5">
      <Button label="Cancel" class="p-button-text" @click="closeDialog" />
      <Button
        :label="isEditing ? 'Update Movie' : 'Save Movie'"
        class="p-button-success"
        @click="saveMovie"
      />
    </div>
  </Dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    visible: Boolean,
    movieData: Object, // This is used for editing an existing movie
  },
  data() {
    return {
      movie: this.getEmptyMovie(),
      errors: {},
      statuses: ["Released", "Upcoming", "Rumored"],
      genres: ["Action", "Comedy", "Horror"],
    };
  },
  computed: {
    isEditing() {
      return this.movieData !== null;
    },
  },
  watch: {
    movieData: {
      immediate: true,
      handler(newMovie) {
        this.movie = newMovie ? { ...newMovie } : this.getEmptyMovie();
      },
    },
  },
  methods: {
    getEmptyMovie() {
      return {
        title: "",
        director: "",
        genres: [],
        status: "",
        release_date: "",
        score: null,
        image_url: "",
      };
    },

    validateForm() {
      this.errors = {};
      if (!this.movie.title) this.errors.title = "Title is required.";
      if (!this.movie.director) this.errors.director = "Director is required.";
      if (!this.movie.genres) this.errors.genres = "Genres must be selected.";
      if (!this.movie.status) this.errors.status = "Status must be selected.";
      if (!this.movie.release_date)
        this.errors.release_date = "Release date is required.";
      if (this.movie.score === null) this.errors.score = "Score is required.";

      return Object.keys(this.errors).length === 0;
    },

    async saveMovie() {
      if (!this.validateForm()) return;

      try {
        const payload = {
          title: this.movie.title,
          description: this.movie.description,
          release_year: this.movie.release_year,
          director: this.movie.director,
          release_date: this.movie.release_date,
          score: this.movie.score,
          status: this.movie.status,
          image_url: this.movie.image_url,
          genres: Array.isArray(this.movie.genres) ? this.movie.genres : [],
        };

        let response;
        if (this.isEditing) {
          response = await axios.put(
            `http://localhost:3000/movies/${this.movie.id}`,
            { movie: payload }
          );
        } else {
          response = await axios.post("http://localhost:3000/movies", {
            movie: payload,
          });
        }

        this.$emit("movie-saved", response.data);
        this.closeDialog();
      } catch (error) {
        console.error("Error saving movie:", error);
      }
    },

    closeDialog() {
      this.$emit("update:visible", false);
    },
  },
};
</script>
