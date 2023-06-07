<script setup lang="ts">
import GoogleMapVue from '@/components/GoogleMap';
import SearchBoxVue from '@/components/SearchBox';
import MarkerListVue from '@/components/MarkerList';
import { ref } from 'vue';

const markerDataList = ref([]);

const handleSelected = (data: any) => {
  markerDataList.value.push(data);
}

const handleDelete = (list: any[]) => {
  const newList = [];
  markerDataList.value.forEach(item => {
    if (!list.includes(item.key)) {
      newList.push(item)
    }
  })
  markerDataList.value = newList;
}
</script>

<template>
  <GoogleMapVue :markers="markerDataList" />
  <SearchBoxVue @selected-address="handleSelected" />
  <MarkerListVue :markers="markerDataList" @delete="handleDelete" />
</template>

<style lang="scss" scoped>

</style>
