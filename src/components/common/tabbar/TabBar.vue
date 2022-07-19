<!--  -->
<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  data() {
    return {
    };
  },

  components: {},

  computed: {},

  methods: {}
}

</script>
<style scoped>
#tab-bar {
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f6f6f6;
  box-shadow: 0 -2px 1px rgba(100, 100, 100, .1);
  /* z-index: 10; */
}

</style>

