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

const utcTimestampInSec = computed(() => Math.floor(currDate.value.getTime() + currDate.value.getTimezoneOffset() / 1000))
const lat = computed(props.lastMarker.lat())
const lng = computed(props.lastMarker.lng())
const timeZoneResponse = await fetchTimeZoneByLocationAndTimestamp(lat, lng, utcTimestampInSec)
const { dstOffset, rawOffset, timeZoneName } = timeZoneResponse
timeZoneOffset.value = (dstOffset + rawOffset) * 1000
timeZoneName.value = timeZoneName
const localTime = computed(() => new Date(new Date().getTime() + timeZoneOffset.value).toLocaleString())

</script>

<style lang="scss" scoped>
.localTime {
  position: absolute;
  right: 12px;
  top: 12px;

  width: 200px;
  padding: 12px;

  background: rgba(0, 0, 0, .3);
  color: white;
}
</style>