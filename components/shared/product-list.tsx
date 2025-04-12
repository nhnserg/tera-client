import type { CategoryWithProducts, Product, Subcategory } from '@/types/redux'
import { ProductCard } from './product/ProductCart'

export const ProductList = ({
  data,
  slug,
}: {
  data: CategoryWithProducts
  slug: string
}) => {
  return (
    <ul className='product-list'>
      {data.products.map((product: Product) => {
        const subcategory = data.subcategories.find((sub: Subcategory) =>
          sub.products.some((p: Product) => p.offerId === product.offerId),
        )
        const subcategorySlug = subcategory?.subcategory.slug

        return (
          <li key={product.offerId}>
            <ProductCard
              product={product}
              slug={slug}
              subcategorySlug={subcategorySlug}
            />
          </li>
        )
      })}
    </ul>
  )
}
