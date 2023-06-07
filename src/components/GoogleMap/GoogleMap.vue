<template>
  <div class="googleMap" ref="rootRef">

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  markers: any[]
}>()

const rootRef = ref();
const googleMapInst = ref();
onMounted(async () => {
  if (!rootRef.value) {
    console.warn('地图容器不存在')
    return
  }

  try {
    const MapsLibrary = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;;
    googleMapInst.value = new MapsLibrary.Map(rootRef.value, {
      zoom: 7,
      center: {
        lat: -25.344, lng: 131.031
      },
      disableDefaultUI: true
    })
  } catch (error) {
    // TODO
  }
})

const markerMap = new Map();

watch(() => props.markers, (list) => {

  if (list.length === 0) {
    // 清空谷歌地图
    markerMap.forEach((item, key) => {
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