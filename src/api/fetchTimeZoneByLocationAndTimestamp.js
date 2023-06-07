import axios from "axios";
import { timeBaseURL, API_KEY } from "@/constants"

// get time by location and timestamp
// https://developers.google.com/maps/documentation/timezone/requests-timezone?hl=zh-cn#required-parameters
const fetchTimeZoneByLocationAndTimestamp = async (lat, lng, timeStampInSec) => {
  const url = `${timeBaseURL}?location=${lat}%2C${lng}&timestamp=${timeStampInSec}&key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

export default fetchTimeZoneByLocationAndTimestamp;
