<template>
<button class="panButton" @click="handleGetLocation">Get Current Location</button>
</template>

<script setup lang="ts">
const emits = defineEmits(['currLocation'])
const handleGetLocation = () => {
  emits('currLocation', true)
}
</script>

<style lang="scss" scoped>
.panButton {
  position: absolute;
  left: 12px;
  top: 12px;
}
</style>