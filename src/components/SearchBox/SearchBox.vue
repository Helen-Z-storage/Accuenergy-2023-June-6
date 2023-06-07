<template>
  <div class="searchBox">
    <input type="text" ref="inputRef">
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emits = defineEmits(['selected-address'])

const inputRef = ref();
const searchBoxInst = ref<google.maps.places.SearchBox>();

onMounted(async () => {
  if (!inputRef.value) {
    console.warn('输入容器不存在')
    return
  }

  try {
    const PlacesLibrary = await google.maps.importLibrary("places") as google.maps.PlacesLibrary
    searchBoxInst.value = new PlacesLibrary.SearchBox(inputRef.value)
    // 绑定时间
    searchBoxInst.value.addListener('places_changed', async () => {
      const places = searchBoxInst.value!.getPlaces() as google.maps.places.PlaceResult[];

      if (places!.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      const { LatLngBounds, Size, Point } = await google.maps.importLibrary('core') as google.maps.CoreLibrary;
      const bounds = new LatLngBounds();

      const firstPlace = places[0];

      if (!firstPlace.geometry || !firstPlace.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const { Marker } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary

      const icon = {
        url: firstPlace.icon,
        size: new Size(71, 71),
        origin: new Point(0, 0),
        anchor: new Point(17, 34),
        scaledSize: new Size(25, 25),
      };

      emits('selected-address', {
        key: firstPlace.formatted_address??'' + new Date().getTime(), bounds, icon, title: firstPlace.formatted_address, position: firstPlace.geometry.location
      })
    })
  } catch (error) {
    // TODO
  }
})
</script>

<style lang="scss" scoped>
.searchBox {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>