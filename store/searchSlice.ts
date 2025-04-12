import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
	query: string
	filters: Record<string, (string | number)[]>
	sortField: string
	sortOrder: 'asc' | 'desc'
	currentPage: number
}

const initialState: SearchState = {
	query: '',
	filters: {},
	sortField: 'RetailPrice',
	sortOrder: 'asc',
	currentPage: 1,
}

const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		setQuery(state, action: PayloadAction<string>) {
			state.query = action.payload
		},
		setFilters(
			state,
			action: PayloadAction<Record<string, (string | number)[]>>
		) {
			state.filters = action.payload
		},
		setSort(
			state,
			action: PayloadAction<{ field: string; order: 'asc' | 'desc' }>
		) {
			state.sortField = action.payload.field
			state.sortOrder = action.payload.order
		},
		setCurrentPage(state, action: PayloadAction<number>) {
			state.currentPage = action.payload
		},
		resetFilters(state) {
			state.filters = {}
			state.sortField = 'RetailPrice'
			state.sortOrder = 'asc'
			state.currentPage = 1
		},
	},
})

export const { setQuery, setFilters, setSort, setCurrentPage, resetFilters } =
	searchSlice.actions
export default searchSlice.reducer

// const query = useSelector((state: RootState) => state.search.query)
// const filters = useSelector((state: RootState) => state.search.filters)
// const sortField = useSelector((state: RootState) => state.search.sortField)
// const sortOrder = useSelector((state: RootState) => state.search.sortOrder)
// const currentPage = useSelector((state: RootState) => state.search.currentPage)

// // Установка значений
// dispatch(setQuery('новый запрос'))
// dispatch(setSort({ field: 'RetailPrice', order: 'asc' }))
// dispatch(setFilters({ color: ['red'], size: [42] }))
// dispatch(setCurrentPage(2))
// dispatch(resetFilters())
