<template>
  <google-map-vue @change-location-status="panToCurrLocation = false" :toLocation="panToCurrLocation" :markers="markerDataList" :currLocation="currLocation" @setCurrLocation="setCurrLocation"/>
  <search-box-vue @selected-address="handleSelected" />
  <marker-list-vue :markers="markerDataList" @delete="handleDelete" />
  <curr-location-vue @currLocation="handleGetLocation" />
  <LocalTimeVue :lastMarker = lastMarker />
</template>

<script setup lang="ts">
import GoogleMapVue from '@/components/GoogleMap';
import SearchBoxVue from '@/components/SearchBox';
import MarkerListVue from '@/components/MarkerList';
import CurrLocationVue from '@/components/CurrLocation';
import LocalTimeVue from '@/components/LocalTime';
import { ref, type Ref } from 'vue';

import type { MarkerProps } from "@/model/MarkerProps.ts"

const markerDataList: Ref<MarkerProps[]> = ref([]);
const lastMarker: Ref<MarkerProps | undefined> = ref()
const panToCurrLocation = ref(true);
const currLocation = ref({lat: 0, lng: 0});

const setCurrLocation = (value: {lat: number, lng: number}) => {
  currLocation.value = value
}

const handleGetLocation = (value: boolean) => {
  panToCurrLocation.value = value;
}

const handleSelected = (data: MarkerProps) => {
  markerDataList.value.unshift(data);
  lastMarker.value = data
  handleGetLocation(false);
}

const handleDelete = (list: Array<string>) => {
  const newList: Array<MarkerProps> = [];
  markerDataList.value.forEach(item => {
    if (!list.includes(item.key)) {
      newList.push(item)
    }
  })
  markerDataList.value = newList;
  handleGetLocation(false);
}
</script>