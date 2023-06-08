<template>
  <div class="localTime">
    <div>{{ localTime }}</div>
    <div>{{ timeZoneName }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import fetchTimeZoneByLocationAndTimestamp from "@/api/fetchTimeZoneByLocationAndTimestamp";

const props = defineProps<{
  lastMarker: any
}>()

const currDate = ref(new Date())
const timeZoneOffset = ref(new Date().getTimezoneOffset())
const timeZoneName = ref("")
const utcTimestampInSec = computed(
  () => Math.floor((currDate.value.getTime() + currDate.value.getTimezoneOffset()) / 1000))

const localTime = computed(() => new Date(new Date().getTime() + timeZoneOffset.value).toLocaleString())
watch(() => props.lastMarker, async () => {
  return;
  if (!props.lastMarker) return;
  console.log(props.lastMarker)
  const { lat, lng } = props.lastMarker.position
  console.log(lat, lng)
  const timeZoneResponse = await fetchTimeZoneByLocationAndTimestamp(lat(), lng(), utcTimestampInSec.value)
  const { dstOffset, rawOffset, timeZoneName: timeZoneName1 } = timeZoneResponse
  timeZoneOffset.value = (dstOffset + rawOffset) * 1000
  timeZoneName.value = timeZoneName1
  console.log(timeZoneResponse)
})

// const currDate = ref(new Date())
// const timeZoneOffset = ref(new Date().getTimezoneOffset())
// const timeZoneName = ref("")

// const utcTimestampInSec = computed(() => Math.floor(currDate.value.getTime() + currDate.value.getTimezoneOffset() / 1000))
// const lat = computed(props.lastMarker.lat())
// const lng = computed(props.lastMarker.lng())
// const timeZoneResponse = await fetchTimeZoneByLocationAndTimestamp(lat, lng, utcTimestampInSec)
// const { dstOffset, rawOffset, timeZoneName: timeZoneName1  } = timeZoneResponse
// timeZoneOffset.value = (dstOffset + rawOffset) * 1000
// timeZoneName.value = timeZoneName1
// const localTime = computed(() => new Date(new Date().getTime() + timeZoneOffset.value).toLocaleString())

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