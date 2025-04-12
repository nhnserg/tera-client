import { useFetchProductByIdQuery } from '@/api/categoryApi'
import { RootState } from '@/store'
import { setSelectedStorage } from '@/store/selectedStorageSlice'
import { StorageKey } from '@/types/redux'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const useProductVariantsByGroupId = ({
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

	const productVariants = useMemo(() => {
		if (!product) return []

		const currentParams = product[storage]
		const groupId = currentParams?.groupId

		if (!groupId) return []

		return Object.keys(product)
			.filter(key => product[key].groupId === groupId)
			.map(key => ({
				variantId: product[key].offerId,
				name: product[key]['Назва товару'],
				quantity: product[key]['Кількість на складі'],
				available: product[key]['Кількість на складі'] > 0,
			}))
	}, [product, storage])

	const changeStorage = (newStorage: StorageKey) => {
		dispatch(setSelectedStorage(newStorage))
	}

	return {
		productVariants,
		error,
		isLoading,
		storage,
		changeStorage,
	}
}
