<template>
  <div class="markerList">
    <button @click="handleDelete">Delete Selected Marker</button>
    <div class="markerList_main">
      <template v-for="item in paginatedMarkers">
        <label class="markerList_item" :for="item.key">
          <input :id="item.key" name="marker" type="checkbox" :value="item.key" v-model="selectedMarker" >
          <span>{{ item.title }}</span>
        </label>
      </template>
    </div>

    <table>
      <tbody>
        <tr>
          <td v-for="item in totalPages" @click="paging.page = item">
            {{ item }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue';

const props = defineProps<{
  markers: any[]
}>()
const emits = defineEmits(['delete'])
const selectedMarker: Ref<string[]> = ref([])
const handleDelete = () => {
  emits('delete', selectedMarker.value)
}

const paging = ref({ page: 1, size: 2 })
watch([...props.markers], () => {
  paging.value.page = 1;
})

const totalPages = computed(() => {
  return Math.ceil(props.markers.length / paging.value.size)
})
const paginatedMarkers = computed(() => {
  return props.markers.slice((paging.value.page - 1) * paging.value.size, paging.value.page * paging.value.size)
})

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