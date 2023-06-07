<template>
  <google-map-vue :toLocation="panToCurrLocation" :markers="markerDataList" />
  <search-box-vue @selected-address="handleSelected" />
  <marker-list-vue :markers="markerDataList" @delete="handleDelete" />
  <curr-location-vue @currLocation="handleGetLocation" />
</template>

<script setup lang="ts">
import GoogleMapVue from '@/components/GoogleMap';
import SearchBoxVue from '@/components/SearchBox';
import MarkerListVue from '@/components/MarkerList';
import CurrLocationVue from '@/components/CurrLocation';
import { ref, onMounted } from 'vue';

const markerDataList = ref([]);
const panToCurrLocation = ref(true);

const handleGetLocation = (value) => {
  panToCurrLocation.value = value;
}

const handleSelected = (data: any) => {
  markerDataList.value.push(data);
  handleGetLocation(false);
}

const handleDelete = (list: any[]) => {
  const newList = [];
  markerDataList.value.forEach(item => {
    if (!list.includes(item.key)) {
      newList.push(item)
    }
  })
  markerDataList.value = newList;
  handleGetLocation(false);
}
</script>



<style lang="scss" scoped>

</style>
