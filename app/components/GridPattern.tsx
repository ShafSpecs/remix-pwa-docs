import type React from "react"
import { useId } from "react"
import { cn } from "~/utils/defatult"

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: Array<[x: number, y: number]>
  strokeDasharray?: string
  className?: string
  enableCurvedFade?: boolean
  rightAligned?: boolean
  [key: string]: unknown
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  enableCurvedFade = false,
  rightAligned = false,
  ...props
}: GridPatternProps) {
  const id = useId()
  const maskId = useId()
  const gradientId = useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      preserveAspectRatio="xMaxYMin meet"
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
        
        {enableCurvedFade && (
          <>
            <radialGradient
              id={gradientId}
              cx={rightAligned ? "58.99%" : "15%"}
              cy={rightAligned ? "-7.2%" : "15%"}
              r="50%"
              fx={rightAligned ? "58.99%" : "5%"}
              fy={rightAligned ? "-7.2%" : "5%"}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="30%" stopColor="white" stopOpacity="0.7" />
              <stop offset="50%" stopColor="white" stopOpacity="0.4" />
              <stop offset="65%" stopColor="white" stopOpacity="0.1" />
              <stop offset="85%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            
            <mask id={maskId}>
              <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
            </mask>
          </>
        )}
      </defs>
      
      <rect 
        width="100%" 
        height="100%" 
        strokeWidth={0} 
        fill={`url(#${id})`} 
        mask={enableCurvedFade ? `url(#${maskId})` : undefined}
      />
      
      {squares && (
        <svg 
          x={x} 
          y={y} 
          className="overflow-visible" 
          mask={enableCurvedFade ? `url(#${maskId})` : undefined}
        >
          {squares.map(([xPos, yPos]) => {
            // When rightAligned is true, position squares relative to the 58.99% point horizontally
            const squareX = rightAligned 
              ? `calc(58.99% - ${(xPos - 2.64) * width}px)` 
              : xPos * width + 1;
              
            return (
              <rect
                strokeWidth="0"
                key={`${xPos}-${yPos}`}
                width={width - 1}
                height={height - 1}
                x={squareX}
                y={yPos * height + 1}
              />
            );
          })}
        </svg>
      )}
    </svg>
  )
}