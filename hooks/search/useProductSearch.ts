import { useState, useEffect } from 'react'
import { useSearchProductsQuery } from '@/api/categoryApi'
import { Product } from '@/types/redux'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'

interface UseProductSearchResult {
	query: string
	setQuery: (query: string) => void
	searchResults: Product[] | undefined
	total: number
	isLoading: boolean
	error: any
	totalPages: number
	currentPage: number
	filters?: Record<string, any>
	setPage: (page: number) => void
}

export const useProductSearch = (
	initialQuery: string = '',
	initialPage: number = 1,
	limit: number = 12,
	filters = {}
): UseProductSearchResult => {
	const [query, setQuery] = useState<string>(initialQuery)
	const [page, setPage] = useState<number>(initialPage)
	const [sortField, setSortField] = useState<string>('RetailPrice')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	const selectedStorage =
		useSelector((state: RootState) => state.selectedStorage.storage) ||
		'paramsFrom_03_MebliPervomaisk'

	const {
		data: searchResultsData,
		error,
		isLoading,
	} = useSearchProductsQuery(
		{
			info: query,
			page,
			limit,
			location: selectedStorage,
			sortField,
			sortOrder,
			filters,
		},
		{ skip: !query }
	)

	const searchParams = useSearchParams()
	const urlPage = searchParams.get('page')
	const urlSortField = searchParams.get('sortField')
	const urlSortOrder = searchParams.get('sortOrder')
	const parsedPage = urlPage ? parseInt(urlPage, 10) : initialPage

	useEffect(() => {
		if (urlSortField) setSortField(urlSortField)
		if (urlSortOrder === 'asc' || urlSortOrder === 'desc')
			setSortOrder(urlSortOrder as 'asc' | 'desc')
		setPage(parsedPage)
	}, [urlPage, urlSortField, urlSortOrder])

	const searchResults = searchResultsData?.results || []
	const total = searchResultsData?.total || 200
	const totalPages = Math.ceil(total / limit) || 1

	return {
		query,
		setQuery,
		searchResults,
		total,
		isLoading,
		error,
		totalPages,
		currentPage: page,
		setPage,
	}
}
