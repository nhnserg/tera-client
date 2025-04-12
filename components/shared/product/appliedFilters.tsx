import { Button } from '@/components/ui'
import { Accord } from '../accord'

interface AppliedFiltersAccordProps {
	minPrice?: number
	maxPrice?: number
	selectedAttributes: Record<string, (string | number)[]>
	sortField?: string
	sortOrder?: string
	onResetFilters: () => void
}

export const AppliedFiltersAccord = ({
	minPrice,
	maxPrice,
	selectedAttributes,
	sortField,
	sortOrder,
	onResetFilters,
}: AppliedFiltersAccordProps) => {
	const hasFilters =
		(minPrice !== undefined &&
			maxPrice !== undefined &&
			!isNaN(minPrice) &&
			!isNaN(maxPrice)) ||
		Object.keys(selectedAttributes).length > 0 ||
		sortField !== undefined

	const sortLabels: Record<string, Record<string, string>> = {
		RetailPrice: {
			asc: 'Від дешевих',
			desc: 'Від дорогих',
		},
	}

	const sortLabel =
		sortField && sortOrder ? sortLabels[sortField]?.[sortOrder] : null

	return (
		<Accord title='Вы выбрали'>
			<div className='flex flex-col gap-2 text-[16px]'>
				{!hasFilters && <div>Фильтры не выбраны</div>}

				{minPrice !== undefined &&
					maxPrice !== undefined &&
					!isNaN(minPrice) &&
					!isNaN(maxPrice) && (
						<div>
							<strong>Цена:</strong> {minPrice} - {maxPrice}
						</div>
					)}

				{sortLabel && (
					<div>
						<strong>Сортировка:</strong> {sortLabel}
					</div>
				)}

				{Object.entries(selectedAttributes).map(([filterKey, selectedValues]) =>
					selectedValues.length > 0 ? (
						<div key={filterKey}>
							<strong>{filterKey}:</strong>{' '}
							{selectedValues.slice(0, 3).join(', ')}
							{selectedValues.length > 3 && (
								<span> и ещё {selectedValues.length - 3}</span>
							)}
						</div>
					) : null
				)}

				{hasFilters && (
					<Button onClick={onResetFilters} className='mt-2 text-xs'>
						Очистить
					</Button>
				)}
			</div>
		</Accord>
	)
}
