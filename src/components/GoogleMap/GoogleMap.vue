<template>
  <div class="googleMap" ref="rootRef">

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { MarkerProps } from "@/model/MarkerProps"

const props = defineProps<{
  markers: Array<MarkerProps>,
  toLocation: boolean,
}>()
const emits = defineEmits(['change-location-status'])

const rootRef = ref();
const googleMapInst = ref();
const currLocation = ref({lat: 0, lng: 0});


onMounted(async () => {
  if (!rootRef.value) {
    console.warn('map container does not exist')
    return
  }

  // Try HTML5 geolocation, setting curr.location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        currLocation.value = pos
      },
      () => console.warn("Error: The Geolocation service failed")
    );
  } else {
    // Browser doesn't support Geolocation
    console.warn("Browser doesn't support Geolocation")
    return
  }

  try {
    const MapsLibrary = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;;
    googleMapInst.value = new MapsLibrary.Map(rootRef.value, {
      zoom: 13,
      center: currLocation.value,
      disableDefaultUI: true
    })
  } catch (error) {
    // TODO
  }
})

const markerMap = new Map();
watch([() => props.toLocation, googleMapInst], () => {
  if (props.toLocation && googleMapInst.value) {
    googleMapInst.value.setCenter(currLocation.value);
    emits('change-location-status', false)
    // handleGetLocation(false);
  }
}, { implements: true })


watch(() => props.markers, (list) => {

  if (list.length === 0) {
    // clear google map
    markerMap.forEach((_, key) => {
      const marker = markerMap.get(key);
      marker.setMap(null)
    })
    markerMap.clear()
    return
  }

  list.forEach(marker => {
    if (markerMap.has(marker.key)) return;
    const { key, icon, title, position, bounds } = marker;
    
    google.maps.importLibrary("marker") 
      .then((markerLib: google.maps.MarkerLibrary) => {
        const marker = new markerLib.Marker({
          map: googleMapInst.value, icon, title, position
        })
        marker.unbind
        markerMap.set(key, marker)
        bounds.extend(position);
        googleMapInst.value.fitBounds(bounds);
      })
  })

  markerMap.forEach((_, key) => {
    const find = list.find(item => item.key === key);
    if (!find) {
      // if can't find, it already deleted from 
      const marker = markerMap.get(key);
      marker.setMap(null)
      markerMap.delete(key)
    }
  })

}, { immediate: true, deep: true })

</script>

<style lang="scss" scoped>
.googleMap {
  width: 100%;
  height: 100%;
}
</style>