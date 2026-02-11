import TrustBar from "@/app/components/TrustBar"

type Props = {
  variant?: "icon-strip" | "bullet-list"
}

export default function PdpTrustSection({
  variant = "icon-strip",
}: Props) {
  return <TrustBar />
}
