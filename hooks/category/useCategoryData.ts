'use client'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetCategoryWithProductsQuery } from '@/api/categoryApi'
import { RootState } from '@/store'
import { Product, Subcategory } from '@/types/redux'

interface CategoryData {
	products: Product[]
	subcategories: Subcategory[]
	category: { name: string; slug: string }
	currentPage: number
	totalPages: number
}

export const useCategoryData = (
	slug: string
): {
	data: CategoryData | null
	isLoading: boolean
	isError: boolean
} => {
	const searchParams = useSearchParams()
	const queryParams = Object.fromEntries(searchParams.entries())

	const {
		page = '1',
		limit = '12',
		sortField,
		sortOrder = 'asc',
		...filters
	} = queryParams

	const selectedStorage = useSelector(
		(state: RootState) => state.selectedStorage.storage
	)

	const { data, isLoading, isError } = useGetCategoryWithProductsQuery({
		slug,
		page: parseInt(page, 10),
		limit: parseInt(limit, 10),
		location: selectedStorage,
		sortField,
		sortOrder,
		...filters,
		includeSubcategories: 'true',
	})

	const productsWithStorage = useMemo(() => {
		if (!data?.products) return []
		return data.products
			.filter((product: Product) => product[selectedStorage]?.['Назва товару'])
			.map((product: Product) => ({
				...product,
				currentParams: product[selectedStorage],
			}))
	}, [data?.products, selectedStorage])

	const subcategoriesWithProducts = useMemo(() => {
		if (!data?.subcategories || !productsWithStorage.length) return []
		const subcategoryIdsWithProducts = new Set(
			productsWithStorage.map(
				(product: Product) => product.currentParams?.subcategoryId
			)
		)
		return data.subcategories.filter((subcategory: Subcategory) =>
			subcategoryIdsWithProducts.has(subcategory.subcategory.slug)
		)
	}, [data?.subcategories, productsWithStorage])

	const totalPages = Math.ceil(
		(productsWithStorage.length || 0) / parseInt(limit, 10)
	)

	return {
		data: {
			products: productsWithStorage,
			subcategories: subcategoriesWithProducts,
			category: data?.category || { name: '', slug: '' },
			currentPage: parseInt(page, 10),
			totalPages,
		},
		isLoading,
		isError,
	}
}
