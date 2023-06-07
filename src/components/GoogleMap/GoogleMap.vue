<template>
  <div class="googleMap" ref="rootRef">

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  markers: any[],
  toLocation: boolean,
}>()

const rootRef = ref();
const googleMapInst = ref();
const currLocation = ref({lat: 0, lng: 0});


onMounted(async () => {
  if (!rootRef.value) {
    console.warn('地图容器不存在')
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
      zoom: 7,
      center: currLocation.value,
      disableDefaultUI: true
    })
  } catch (error) {
    // TODO
  }
})

const markerMap = new Map();
watch(() => props.toLocation, (toLocation) => {
  if (toLocation && googleMapInst.value) {
    console.log("props.toLocation")
    googleMapInst.value.setCenter(currLocation.value);
    console.log("set center")
    // handleGetLocation(false);
  }

})


watch(() => props.markers, (list) => {

  if (list.length === 0) {
    // 清空谷歌地图
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
    // 没有
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

  markerMap.forEach((item, key) => {
    const find = list.find(item => item.key === key);
    debugger
    if (!find) {
      // 找不到表示已经删除
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