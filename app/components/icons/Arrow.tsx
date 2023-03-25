/* eslint-disable react/display-name */
export default () => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className="h-8 w-8 [--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]"
    >
      <defs>
        <radialGradient
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          id=":R1h19n6:-gradient"
          gradientTransform="matrix(0 21 -21 0 12 3)"
        >
          <stop stopColor="#0EA5E9" />
          <stop stopColor="#22D3EE" offset=".527" />
          <stop stopColor="#818CF8" offset={1} />
        </radialGradient>
        <radialGradient
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          id=":R1h19n6:-gradient-dark"
          gradientTransform="matrix(0 21 -21 0 16 7)"
        >
          <stop stopColor="#0EA5E9" />
          <stop stopColor="#22D3EE" offset=".527" />
          <stop stopColor="#818CF8" offset={1} />
        </radialGradient>
      </defs>
      <g className="dark:hidden">
        <circle cx={12} cy={12} r={12} fill="url(#:R1h19n6:-gradient)" />
        <path
          d="m8 8 9 21 2-10 10-2L8 8Z"
          fillOpacity="0.5"
          className="fill-[var(--icon-background)] stroke-[color:var(--icon-foreground)]"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="hidden dark:inline">
        <path
          d="m4 4 10.286 24 2.285-11.429L28 14.286 4 4Z"
          fill="url(#:R1h19n6:-gradient-dark)"
          stroke="url(#:R1h19n6:-gradient-dark)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}