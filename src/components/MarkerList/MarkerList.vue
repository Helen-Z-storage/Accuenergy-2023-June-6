<template>
  <div class="markerList">
    <button @click="handleDelete">删除选中的Marker</button>
    <div class="markerList_main">
      <template v-for="item in markers">
        <label class="markerList_item" :for="item.key">
          <input :id="item.key" name="marker" type="checkbox" :value="item.key" v-model="selectedMarker" >
          <span>{{ item.title }}</span>
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  markers: any[]
}>()
const emits = defineEmits(['delete'])
const selectedMarker = ref([])
const handleDelete = () => {
  emits('delete', selectedMarker.value)
}
</script>

<style lang="scss" scoped>
.markerList {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translate(0, -50%);

  width: 200px;
  padding: 12px;

  background: #fff;

  &_main {
    display: flex;
    flex-direction: column;
    gap: 12;
  }

  &_item {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>