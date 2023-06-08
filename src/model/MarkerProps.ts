export interface MarkerProps {
  key: string 
  bounds: google.maps.LatLngBounds
  icon: google.maps.Icon
  title: string
  position: google.maps.LatLngLiteral
}