import { useFetchProductByIdQuery } from '@/api/categoryApi'
import { RootState } from '@/store'
import { setSelectedStorage } from '@/store/selectedStorageSlice'
import { StorageKey } from '@/types/redux'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const useProductData = ({
	slug,
	subcategorySlug,
	offerId,
}: {
	slug: string
	subcategorySlug: string
	offerId: string
}) => {
	const dispatch = useDispatch()

	const { storage } = useSelector((state: RootState) => state.selectedStorage)

	const { data, error, isLoading } = useFetchProductByIdQuery({
		slug,
		subcategorySlug,
		offerId,
	})

	const product = data?.product || null

	const availableStorages = useMemo(() => {
		if (!product) return []
		return Object.keys(product)
			.filter(
				key =>
					key.startsWith('paramsFrom_') &&
					product[key]?.['Відображення на сайті'] === '1'
			)
			.map(key => ({
				location: key,
				available: product[key]?.['Кількість на складі'] > 0,
			}))
	}, [product])

	const currentParams = product ? product[storage] : null

	const changeStorage = (newStorage: StorageKey) => {
		dispatch(setSelectedStorage(newStorage))
	}

	let mainCategory = 'Не указано'
	let subCategory = ''

	if (product && currentParams) {
		const fullCategorySync = currentParams?.['Розділ синхронізації повністю']
		const categoryParts = fullCategorySync ? fullCategorySync.split(';') : []

		mainCategory = categoryParts[0]?.split('=')[1]?.trim() || mainCategory

		if (categoryParts.length > 1) {
			subCategory = categoryParts[1]?.split('=')[1]?.trim() || ''
		}
	}

	return {
		mainCategory,
		subCategory,
		product,
		currentParams,
		error,
		isLoading,
		availableStorages,
		storage,
		changeStorage,
	}
}
