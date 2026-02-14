export function Price({
  price,
  mrp,
}: {
  price: number
  mrp?: number
}) {
  return <div>₹{price}</div>
}
