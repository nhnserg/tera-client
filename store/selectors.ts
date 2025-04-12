import { createSelector } from 'reselect'
import { RootState } from './index'
import { CartItem } from '@/types/cart'

export const selectAllCategories = createSelector(
	(state: RootState) => state.categoryApi.queries,
	queries => queries?.['getAllCategories(undefined)']?.data || []
)

export const selectSubcategoriesByCategoryId = (categoryId: number) =>
	createSelector(
		(state: RootState) => state.categoryApi.queries,
		queries => {
			const queryKey = `getSubcategories("${categoryId}")`
			return queries?.[queryKey]?.data || []
		}
	)

export const selectCategoryProducts = ({
	categoryId,
	page = 1,
	limit = 12,
	location = 'mebliPervomaisk',
	sortField,
	sortOrder,
	filters = {},
}: {
	categoryId: number
	page?: number
	limit?: number
	location?: string
	sortField?: string
	sortOrder?: string
	filters?: Record<string, any>
}) =>
	createSelector(
		(state: RootState) => state.categoryApi.queries,
		queries => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				location,
				...(sortField && { sortField }),
				...(sortOrder && { sortOrder }),
				...filters,
			}).toString()

			const queryKey = `getCategoryWithProducts("${categoryId}?${params}")`
			const data = queries?.[queryKey]?.data || null
			const isLoading = queries?.[queryKey]?.status === 'pending'
			const error = queries?.[queryKey]?.error || null

			return { data, isLoading, error }
		}
	)

export const selectSubcategoryProducts = ({
	categoryId,
	subcategoryId,
	page = 1,
	limit = 12,
	location = 'mebliPervomaisk',
	sortField,
	sortOrder,
	filters = {},
}: {
	categoryId: number
	subcategoryId: number
	page?: number
	limit?: number
	location?: string
	sortField?: string
	sortOrder?: string
	filters?: Record<string, any>
}) =>
	createSelector(
		(state: RootState) => state.categoryApi.queries,
		queries => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				location,
				...(sortField && { sortField }),
				...(sortOrder && { sortOrder }),
				...filters,
			}).toString()

			const queryKey = `getProductsForSubcategory("${categoryId}/${subcategoryId}?${params}")`
			const data = queries?.[queryKey]?.data || null
			const isLoading = queries?.[queryKey]?.status === 'pending'
			const error = queries?.[queryKey]?.error || null

			return { data, isLoading, error }
		}
	)

export const selectCartItems = (state: RootState): CartItem[] =>
	state.cart.items

export const selectCartTotal = (state: RootState): number => {
	return state.cart.items.reduce((total, item) => {
		const price: any = item.RetailPriceWithDiscount ?? item.RetailPrice
		return total + price * item.quantity
	}, 0)
}

export const selectCartItemCount = (state: RootState): number => {
	return state.cart.items.reduce((count, item) => count + item.quantity, 0)
}

const createQueryKey = (endpoint: string, params: Record<string, any> = {}) => {
	return `${endpoint}(${JSON.stringify(params)})`
}
