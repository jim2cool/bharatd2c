import TrustBar from "@/components/ui/trust-bar"

type Props = {
  variant?: "icon-strip" | "bullet-list"
}

export default function PdpTrustSection({
  variant = "icon-strip",
}: Props) {
  return <TrustBar />
}

