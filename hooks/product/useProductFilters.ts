import { useMemo } from 'react'
import { Product } from '@/types/redux'

interface ProductFilters {
	minPrice?: number
	maxPrice?: number
	attributes?: Record<string, (string | number)[]>
}

export const useProductFilters = (
	products: Product[],
	{ minPrice, maxPrice, attributes = {} }: ProductFilters
) => {
	return useMemo(() => {
		let filteredProducts = products.filter(product => {
			const productPrice = Number(product.selectedStorage?.RetailPrice || 0)
			const priceCondition =
				(minPrice === undefined || productPrice >= minPrice) &&
				(maxPrice === undefined || productPrice <= maxPrice)

			const attributeCondition = Object.entries(attributes).every(
				([key, values]) => {
					const productValue = product.currentParams?.[key]
					return values.includes(productValue)
				}
			)

			return priceCondition && attributeCondition
		})

		return filteredProducts
	}, [products, minPrice, maxPrice, attributes])
}
