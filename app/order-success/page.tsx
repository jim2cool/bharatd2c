export default function OrderSuccess() {
  return (
  <div className="max-w-3xl mx-auto px-4 py-12 text-center">
    <div className="mb-6">
      <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          className="h-7 w-7 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">
        Order Confirmed
      </h1>

      <p className="mt-2 text-gray-600">
        Thank you for your order. We’ve received it successfully.
      </p>
    </div>

    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-left">
      <p className="font-medium text-gray-900 mb-2">
        What happens next?
      </p>

      <ul className="space-y-2 text-sm text-gray-700">
        <li>• Our team will verify your order</li>
        <li>• You’ll receive a confirmation call for Cash on Delivery</li>
        <li>• Dispatch details will be shared once shipped</li>
      </ul>
    </div>

    <div className="mt-8 space-y-4">
      <p className="text-sm text-gray-600">
        Need help or want to make a change?
      </p>

      <a
        href="https://wa.me/91XXXXXXXXXX"
        className="inline-block rounded-md bg-black px-6 py-3 text-white text-sm font-medium hover:bg-gray-900"
      >
        Contact Support on WhatsApp
      </a>

      <div>
        <a
          href="/products"
          className="text-sm font-medium text-gray-700 underline"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  </div>
);

}
