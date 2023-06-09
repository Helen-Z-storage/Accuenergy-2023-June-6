<template>
  <div class="localTime">
    <div>{{ localTime }}</div>
    <div>{{ localTimeZoneName }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import fetchTimeZoneByLocationAndTimestamp from "@/api/fetchTimeZoneByLocationAndTimestamp";
import type { MarkerProps } from "@/model/MarkerProps"

const props = defineProps<{
  lastMarker: MarkerProps | undefined
}>()

const currDate = ref(new Date())
const localTimeZoneName = ref("")

// getTime return timestamp in milisec, getTimezoneOffset() return offset in min
const utcTimestampInMiliSec = computed(
  () => currDate.value.getTime() + currDate.value.getTimezoneOffset() * 60 * 1000)
const utcTimestampInSec = computed(
  () => Math.floor(utcTimestampInMiliSec.value / 1000))

// store offset that utcTimestamp + offset = local timestamp
const timeZoneOffsetInSec = ref( - new Date().getTimezoneOffset() * 60)
const localTime = computed(() => new Date(utcTimestampInMiliSec.value + timeZoneOffsetInSec.value * 1000).toLocaleString())

onMounted(() => {
  
  // Try HTML5 geolocation, setting curr.location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const { lat, lng } = pos;
        const timeZoneResponse = await fetchTimeZoneByLocationAndTimestamp(lat, lng, utcTimestampInSec.value)
        const { timeZoneName } = timeZoneResponse
        localTimeZoneName.value = timeZoneName
      },
      () => console.warn("Error: The Geolocation service failed")
    );
  } else {
    // Browser doesn't support Geolocation
    console.warn("Browser doesn't support Geolocation")
    return
  }
  // for time jumping in sec
  setInterval(() => { currDate.value = new Date() }, 1000);
})

watch(() => props.lastMarker, async () => {
  if (!props.lastMarker || !props.lastMarker.position) return;
  const { lat, lng } = props.lastMarker.position
  const timeZoneResponse = await fetchTimeZoneByLocationAndTimestamp(lat(), lng(), utcTimestampInSec.value)
  const { dstOffset, rawOffset, timeZoneName } = timeZoneResponse
  timeZoneOffsetInSec.value = (dstOffset + rawOffset) * 1000
  localTimeZoneName.value = timeZoneName
})
</script>

<style lang="scss" scoped>
.localTime {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 10000;
  width: 200px;
  padding: 12px;

  background: rgb(0, 0, 0);
  color: white;
}
</style>