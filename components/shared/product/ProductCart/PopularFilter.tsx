import { Button } from '@/components/ui'

type PopularFilterType = {
	className?: string
	onSortChange: (sortField: string, sortOrder: 'asc' | 'desc') => void
}
export const PopularFilter = ({ className, onSortChange }: PopularFilterType) => {
	const sortOptions = [
		{
			label: 'Від дорогих',
			sortField: 'RetailPrice',
			sortOrder: 'desc' as const,
		},
		{
			label: 'Від дешевих',
			sortField: 'RetailPrice',
			sortOrder: 'asc' as const,
		},
	]

	return (
		<div className={className}>
			{sortOptions.map((option, index) => (
				<Button
					key={index}
					variant='outline'
					className='px-3 py-1 h-7'
					onClick={() => onSortChange(option.sortField, option.sortOrder)}
				>
					{option.label}
				</Button>
			))}
		</div>
	)
}
