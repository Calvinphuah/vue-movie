<template>
  <div>
    <MenuBar />
    <Movies />
  </div>
</template>

<script>
import MenuBar from "../components/MenuBar.vue";
import Movies from "../components/Movies.vue";

export default {
  components: { Movies, MenuBar },
};
</script>

<style lang="scss" scoped></style>
