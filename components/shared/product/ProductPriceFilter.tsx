import { Button, Input } from '@/components/ui'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Accord } from '../accord'
import { RangeSlider } from '../range-slider'

export const ProductPriceFilter = ({
	title,
	onApplyPriceFilter,
	minPrice = 0,
	maxPrice = 100000,
}: {
	title: string
	onApplyPriceFilter: (min: number, max: number) => void
	minPrice?: number
	maxPrice?: number
}) => {
	const [minValue, setMinValue] = useState<number>(minPrice)
	const [maxValue, setMaxValue] = useState<number>(maxPrice)

	useEffect(() => {
		setMinValue(minPrice)
		setMaxValue(maxPrice)
	}, [minPrice, maxPrice])

	const handleSliderChange = (values: number[]) => {
		setMinValue(values[0])
		setMaxValue(values[1])
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = event.target
		const numericValue = Number(value)

		if (id === 'min-price' && numericValue <= (maxValue || maxPrice)) {
			setMinValue(numericValue)
		} else if (id === 'max-price' && numericValue >= (minValue || minPrice)) {
			setMaxValue(numericValue)
		}
	}

	const applyFilter = () => {
		onApplyPriceFilter(minValue, maxValue)
	}

	return (
		<Accord title={title}>
			<div className='flex flex-col gap-2 text-xs w-full'>
				<div className='flex justify-between items-center gap-2'>
					<Label htmlFor='min-price'>от</Label>
					<Input
						type='number'
						id='min-price'
						placeholder={minPrice.toString()}
						min={minPrice}
						max={maxPrice}
						value={minValue}
						onChange={handleInputChange}
					/>
					<Label htmlFor='max-price'>до</Label>
					<Input
						type='number'
						id='max-price'
						placeholder={maxPrice.toString()}
						min={minPrice}
						max={maxPrice}
						value={maxValue}
						onChange={handleInputChange}
					/>
				</div>

				<RangeSlider
					min={minPrice}
					max={maxPrice}
					step={10}
					value={[minValue, maxValue]}
					onValueChange={handleSliderChange}
				/>

				<Button onClick={applyFilter} className='px-20 py-2 bg-gray mt-4'>
					Применить
				</Button>
			</div>
		</Accord>
	)
}
