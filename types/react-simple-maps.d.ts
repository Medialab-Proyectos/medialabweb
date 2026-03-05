declare module "react-simple-maps" {
  import { ComponentType, ReactNode, SVGProps, MouseEventHandler } from "react"

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    style?: React.CSSProperties
    children?: ReactNode
  }
  export const ComposableMap: ComponentType<ComposableMapProps>

  export interface ZoomableGroupProps {
    zoom?: number
    minZoom?: number
    maxZoom?: number
    children?: ReactNode
  }
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>

  export interface GeographiesProps {
    geography: string | object
    children: (props: { geographies: unknown[] }) => ReactNode
  }
  export const Geographies: ComponentType<GeographiesProps>

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: unknown
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
  }
  export const Geography: ComponentType<GeographyProps>

  export interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
    onMouseEnter?: MouseEventHandler<SVGGElement>
    onMouseLeave?: MouseEventHandler<SVGGElement>
    onClick?: MouseEventHandler<SVGGElement>
  }
  export const Marker: ComponentType<MarkerProps>
}
