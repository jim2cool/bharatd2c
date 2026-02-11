export default function PDPLayout({
  left,
  right,
  mobileCTA,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  mobileCTA: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>{left}</div>

        <div className="space-y-6">
          {right}
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-3 lg:hidden">
        {mobileCTA}
      </div>
    </div>
  );
}
