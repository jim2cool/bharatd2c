import CTAStack from "../components/CTAStack"

type Props = {
  product: any
  variant?: "inline" | "sticky"
}

export default function PdpCTASection({
  product,
  variant = "inline",
}: Props) {
  /**
   * v1 behavior:
   * - inline: render existing CTAStack
   * - sticky: handled by layout / CSS, not here yet
   */
  return <CTAStack product={product} />
}
