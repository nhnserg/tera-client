'use client'
import { CrumbsLinks } from '@/components/shared/CrumbsLinks'
import Pagination from '@/components/shared/Pagination'
import { AppliedFiltersAccord } from '@/components/shared/product/appliedFilters'
import { ProductCard } from '@/components/shared/product/ProductCart'
import { ProductFilter } from '@/components/shared/product/ProductFilter'
import { ProductPriceFilter } from '@/components/shared/product/ProductPriceFilter'
import { useProductSearch } from '@/hooks/search/useProductSearch'
import { useProductFilters } from '@/hooks/product/useProductFilters'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/types/redux'
import { useState, useMemo } from 'react'
import { FilterState } from '@/types'
import { PopularFilter } from '@/components/shared/product/ProductCart/PopularFilter'
export const dynamic = 'force-dynamic'



const Filters = ({
	showAppliedFilters,
	minMaxPrices,
	minPrice,
	maxPrice,
	selectedAttributes,
	products,
	sortField,
	sortOrder,
	handleApplyPriceFilter,
	handleAttributeFilter,
	resetFilters,
	className,
}: {
	showAppliedFilters: boolean
	minMaxPrices: { minPrice: number; maxPrice: number } | undefined
	minPrice: number | undefined
	maxPrice: number | undefined
	selectedAttributes: Record<string, any>
	sortField?: string
	sortOrder?: string
	products: Product[]
	handleApplyPriceFilter: (min: number, max: number) => void
	handleAttributeFilter: (filters: Record<string, (string | number)[]>) => void
	resetFilters: () => void
	className?: string
}): JSX.Element => (
	<div className={className}>
		{showAppliedFilters && (
			<AppliedFiltersAccord
				minPrice={minPrice}
				maxPrice={maxPrice}
				selectedAttributes={selectedAttributes}
				sortField={sortField}
				sortOrder={sortOrder}
				onResetFilters={resetFilters}
			/>
		)}
		{minMaxPrices && (
			<ProductPriceFilter
				title='Ціна'
				onApplyPriceFilter={handleApplyPriceFilter}
				minPrice={minMaxPrices.minPrice}
				maxPrice={minMaxPrices.maxPrice}
			/>
		)}
		<ProductFilter
			title=''
			products={products}
			onFilterChange={handleAttributeFilter}
			onResetFilters={resetFilters}
		/>
	</div>
)

export default function SearchPage() {
	const searchParams = useSearchParams()
	const query = searchParams.get('search') || ''
	const router = useRouter()

	const {
		searchResults,
		isLoading,
		error,
		totalPages,
		currentPage,
		setPage,
		query: searchQuery,
	} = useProductSearch(query)

	const [filters, setFilters] = useState<FilterState>({
		minPrice: undefined,
		maxPrice: undefined,
		selectedAttributes: {},
		sortField: undefined,
		sortOrder: 'asc',
		showAppliedFilters: false,
	})

	const minMaxPrices = useMemo(() => {
		if (!searchResults || searchResults.length === 0) {
			return { minPrice: 0, maxPrice: 100000 }
		}
		const prices = searchResults.map(
			product => product.currentParams?.RetailPrice || 0
		)
		return {
			minPrice: Math.min(...prices),
			maxPrice: Math.max(...prices),
		}
	}, [searchResults])

	const handleSortChange = (sortField: string, sortOrder: 'asc' | 'desc') => {
		setFilters(prev => ({
			...prev,
			sortField,
			sortOrder,
			showAppliedFilters: true,
		}))

		const params = new URLSearchParams(window.location.search)
		params.set('sortField', sortField)
		params.set('sortOrder', sortOrder)
		params.set('page', '1')
		router.push(`/search?${params.toString()}`)
	}

	const handleApplyPriceFilter = (min: number, max: number) => {
		setFilters(prev => ({
			...prev,
			minPrice: min,
			maxPrice: max,
			showAppliedFilters: true,
		}))
	}

	const handleAttributeFilter = (
		selectedAttributes: Record<string, (string | number)[]>
	) => {
		setFilters(prev => ({
			...prev,
			selectedAttributes,
			showAppliedFilters: true,
		}))

		const params = new URLSearchParams(window.location.search)
		Object.entries(selectedAttributes).forEach(([key, values]) => {
			params.set(key, values.join(','))
		})
		params.set('page', '1')
		router.push(`/search?${params.toString()}`)
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

		const params = new URLSearchParams(window.location.search)
		params.delete('minPrice')
		params.delete('maxPrice')
		params.delete('sortField')
		params.delete('sortOrder')
		params.set('page', '1')
		router.push(`/search?${params.toString()}`)
	}

	const filteredProducts = useProductFilters(searchResults ?? [], {
		minPrice: filters.minPrice,
		maxPrice: filters.maxPrice,
		attributes: filters.selectedAttributes,
	})

	const handlePageChange = async (page: number) => {
		const params = new URLSearchParams(window.location.search)
		params.set('page', page.toString())
		router.push(`/search?${params.toString()}`)
		setPage(page)
	}

	if (isLoading) {
		return <p>Пошук продуктів...</p>
	}

	if (error) {
		return <p>Помилка загрузки продуктів</p>
	}

	return (
		<div className='mb-[75px]'>
			<div className='flex relative'>
				<CrumbsLinks
					customBreadcrumb={[{ name: `Результати пошуку: ${query}` }]}
					currentPage='search'
				/>
				<PopularFilter
					onSortChange={handleSortChange}
					className='absolute right-0 translate-y-full hidden xl:flex gap-4'
				/>
			</div>
			<div className='flex flex-col gap-8 md:flex-row md:justify-between'>
				<Filters
					className='flex flex-col gap-2 max-w-[280px] sm:min-w-[280px]'
					showAppliedFilters={filters.showAppliedFilters}
					minMaxPrices={minMaxPrices}
					minPrice={filters.minPrice}
					sortField={filters.sortField}
					sortOrder={filters.sortOrder}
					maxPrice={filters.maxPrice}
					selectedAttributes={filters.selectedAttributes}
					products={searchResults ?? []}
					handleApplyPriceFilter={handleApplyPriceFilter}
					handleAttributeFilter={handleAttributeFilter}
					resetFilters={resetFilters}
				/>

				<div className='flex flex-1 gap-y-8 justify-between flex-wrap h-[max-content] max-w-[970px]'>
					{filteredProducts.length > 0 ? (
						filteredProducts.map(product => (
							<ProductCard key={product.offerId} product={product} />
						))
					) : (
						<p className='text-gray-500'>
							Немає доступних продуктів для відображення.
						</p>
					)}
					<div className='flex flex-col justify-center w-full'>
						<Pagination
							currentPage={currentPage ?? 1}
							totalPages={totalPages ?? 1}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
