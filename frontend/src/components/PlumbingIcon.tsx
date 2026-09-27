import type { SVGProps } from 'react'

export default function PlumbingIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3h8v4H3zM5 7v9a5 5 0 0 0 5 5h7v-6h-5a1 1 0 0 1-1-1V7M17 13h4v10h-4z" /></svg>
}
