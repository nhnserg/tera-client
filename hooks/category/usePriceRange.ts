import { useMemo } from 'react'
import { Product } from '@/types/redux'

export const usePriceRange = (products: Product[], location: string) => {
	const { minPrice, maxPrice } = useMemo(() => {
		if (!products || products.length === 0 || !location) {
			return { minPrice: 0, maxPrice: 0 }
		}

		const prices = products
			.map(product => product[location]?.RetailPrice)
			.filter(price => price !== undefined)

		if (prices.length === 0) {
			return { minPrice: 0, maxPrice: 0 }
		}

		return {
			minPrice: Math.min(...prices),
			maxPrice: Math.max(...prices),
		}
	}, [products, location])

	return { minPrice, maxPrice }
}
