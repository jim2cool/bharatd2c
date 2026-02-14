import { ReactNode } from "react"

export function renderIf(condition: any, node: ReactNode) {
  if (!condition) return null
  return node
}
