import { ReactNode } from "react"

// ✅ KEEP your tokens as NAMED exports
export const layoutTokens = {
  pageMaxWidth: "max-w-6xl",
  pagePaddingX: "px-4",
  sectionSpacing: "mt-6",
  sectionSpacingLarge: "mt-10",
}

// ✅ REQUIRED: default export MUST be a React component
export default function TokensLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
