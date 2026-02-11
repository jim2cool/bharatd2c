import Link from "next/link"
import Image from "next/image"
import { RelatedProduct } from "../../types/pdp"
import { Button } from "@/components/ui/button"

interface PeopleAlsoBoughtProps {
    products: RelatedProduct[]
}

export function PeopleAlsoBought({ products }: PeopleAlsoBoughtProps) {
    if (!products || products.length === 0) return null

    return (
        <section data-cluster="aov" className="py-8 md:py-12 border-t border-border/10">
            <h2 className="text-xl md:text-2xl font-normal mb-8 tracking-tight text-foreground text-left">
                You may also like
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                {products.map((product) => (
                    <Link key={product.id} href={`./${product.slug}`} className="group block h-full">
                        {/* Dawn-style: Image container 1:1 SQUARE */}
                        <div className="aspect-square relative overflow-hidden bg-muted/20 mb-4 rounded-sm">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted/30 text-muted-foreground/40 text-xs">
                                    NO IMAGE
                                </div>
                            )}

                            {/* Sale Badge - Bottom Left, Clean */}
                            {product.mrp > product.price && (
                                <div className="absolute bottom-2 left-2 bg-foreground text-background text-[10px] font-medium px-2 py-1 uppercase tracking-wider rounded-sm">
                                    Sale
                                </div>
                            )}
                        </div>

                        {/* Content: Simple text, left aligned */}
                        <div className="flex flex-col gap-1.5">
                            <h3 className="font-normal text-sm text-foreground group-hover:underline underline-offset-4 decoration-1 decoration-foreground/50 transition-all">
                                {product.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-normal text-foreground">₹{product.price}</span>
                                {product.mrp > product.price && (
                                    <span className="text-muted-foreground line-through text-xs">₹{product.mrp}</span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
