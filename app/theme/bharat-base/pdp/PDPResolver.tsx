import PDPLayout from "./PDPLayout";
import HeroBlock from "./sections/HeroBlock";
import ConversionBlock from "./sections/ConversionBlock";
import ImageGallery from "./sections/ImageGallery";

export default function PDPResolver({
  product,
  variants,
}: {
  product: any;
  variants: any[];
}) {
  if (!product || !variants || variants.length === 0) return null;

  const variant =
    variants.find(v => v.is_default) || variants[0];

  return (
    <PDPLayout
      left={<ImageGallery images={product.images || []} />}
      right={
        <>
          <HeroBlock
            title={product.title}
            rating={product.rating}
            reviewCount={product.review_count}
            highlights={product.highlights}
          />

          {/* DESKTOP CONVERSION */}
          <div className="hidden lg:block">
            <ConversionBlock
              productId={variant.id}
              title={product.title}
              price={variant.price}
              mrp={variant.mrp}
              codAvailable={product.cod_allowed}
              prepaidEnabled={product.prepaid_enabled}
              prepaidDiscountPercent={
                product.prepaid_discount_percent
              }
            />
          </div>
        </>
      }
      mobileCTA={
        <ConversionBlock
          productId={variant.id}
          title={product.title}
          price={variant.price}
          mrp={variant.mrp}
          codAvailable={product.cod_allowed}
          prepaidEnabled={product.prepaid_enabled}
          prepaidDiscountPercent={
            product.prepaid_discount_percent
          }
          isMobile
        />
      }
    />
  );
}
