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
          <td>
            <button v-if="prevPage" @click="goPrevPage">Previous</button>
          </td>
          <td>
            <div>Page {{ paging.page }}</div>
          </td>
          <td>
            <button v-if="nextPage" @click="goNextPage">Next</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref, toRefs, reactive } from 'vue';
import type { MarkerProps } from "@/model/MarkerProps"
import findPreviousAndNextPages from "@/utils/findPreviousAndNextPages";

const props = defineProps<{
  markers: Array<MarkerProps>
}>()
const emits = defineEmits(['delete'])
const selectedMarker: Ref<Array<string>> = ref([])
const handleDelete = () => {
  emits('delete', selectedMarker.value)
}

const paging = toRefs(reactive({ page: 1, size: 10 }))

watch([...props.markers], () => {
  paging.page.value = 1;
})

const totalPages = computed(() => {
  return Math.ceil(props.markers.length / paging.size.value)
})
const paginatedMarkers = computed(() => {
  return props.markers.slice((paging.page.value - 1) * paging.size.value, paging.page.value * paging.size.value)
})

const { prevPage, nextPage } = findPreviousAndNextPages(paging.page, totalPages);
const goPrevPage = () => {
  console.log(prevPage.value)
  if (prevPage.value) {
    paging.page.value = prevPage.value
  }
}
const goNextPage = () => {
  console.log(nextPage.value)
  if (nextPage.value) {
    paging.page.value = nextPage.value
    console.log(paging)
  }
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