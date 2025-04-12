import { FilterState } from '@/types'
import { useState } from 'react'

export const useFilters = (initialFilters: FilterState) => {
	const [filters, setFilters] = useState<FilterState>(initialFilters)

	const applyPriceFilter = (min: number, max: number) => {
		setFilters(prev => ({
			...prev,
			minPrice: min,
			maxPrice: max,
			showAppliedFilters: true,
		}))
	}

	const applyAttributeFilter = (
		attributes: Record<string, (string | number)[]>
	) => {
		setFilters(prev => ({
			...prev,
			selectedAttributes: attributes,
			showAppliedFilters: true,
		}))
	}

	const resetFilters = () => {
		setFilters({
			minPrice: undefined,
			maxPrice: undefined,
			selectedAttributes: {},
			sortField: undefined,
			sortOrder: 'asc',
			showAppliedFilters: false,
		})
	}

	return { filters, applyPriceFilter, applyAttributeFilter, resetFilters }
}
