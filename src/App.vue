<template>
  <google-map-vue :toLocation="panToCurrLocation" :markers="markerDataList" :currLocation="currLocation" @setCurrLocation="setCurrLocation"/>
  <search-box-vue @selected-address="handleSelected" />
  <marker-list-vue :markers="markerDataList" @delete="handleDelete" />
  <curr-location-vue @currLocation="handleGetLocation" />
  <local-time-vue :lastMarker = lastMarker />
</template>

<script setup lang="ts">
import GoogleMapVue from '@/components/GoogleMap';
import SearchBoxVue from '@/components/SearchBox';
import MarkerListVue from '@/components/MarkerList';
import CurrLocationVue from '@/components/CurrLocation';
import LocalTimeVue from '@/components/LocalTime';
import { ref, onMounted } from 'vue';

const markerDataList = ref([]);
const lastMarker = ref()
const panToCurrLocation = ref(true);
const currLocation = ref({lat: 0, lng: 0});

const setCurrLocation = (value: {lat: number, lng: number}) => {
  currLocation.value = value
}

const handleGetLocation = (value: boolean) => {
  panToCurrLocation.value = value;
}

const handleSelected = (data: any) => {
  markerDataList.value.unshift(data);
  console.log(lastMarker)
  lastMarker.value = data
  handleGetLocation(false);
}

const handleDelete = (list: any[]) => {
  const newList = [];
  markerDataList.value.forEach(item => {
    if (!list.includes(item.key)) {
      newList.unshift(item)
    }
  })
  markerDataList.value = newList;
  //newList.length !== 0 ? lastMarker.value = newList[0]: 
  handleGetLocation(false);
}

onMounted(() => {
  
  // Try HTML5 geolocation, setting curr.location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        lastMarker.value = pos
      },
      () => console.warn("Error: The Geolocation service failed")
    );
  } else {
    // Browser doesn't support Geolocation
    console.warn("Browser doesn't support Geolocation")
    return
  }
}
  

)
</script>



<style lang="scss" scoped>

</style>
