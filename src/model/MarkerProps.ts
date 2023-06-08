import type { PositionProps } from "@/model/PositionProps"
import type { IconProps } from "@/model/IconProps"

export interface MarkerProps {
  key: string 
  bounds: object
  icon: IconProps
  title: string
  position: PositionProps
}