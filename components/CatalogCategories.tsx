import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
	useGetAllCategoriesQuery,
	useGetSubcategoriesQuery,
} from '@/api/categoryApi'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui'

interface CategoriesProps {
	onSelectCategory: (categoryId: number) => void
	currentLanguage: 'UA' | 'RU'
	closeSheet: () => void
}

export const CatalogCategories = ({
	currentLanguage,
	onSelectCategory,
	closeSheet,
}: CategoriesProps) => {
	const {
		data: categories,
		error: categoriesError,
		isLoading: categoriesLoading,
	} = useGetAllCategoriesQuery()

	const [expandedCategories, setExpandedCategories] = useState<number[]>([])

	const handleToggle = (categoryId: number) => {
		setExpandedCategories(prev =>
			prev.includes(categoryId)
				? prev.filter(id => id !== categoryId)
				: [...prev, categoryId]
		)
	}

	const renderErrorMessage = (error: any) => {
		return (
			<p className='text-red-500'>
				Ошибка при загрузке категорий:{' '}
				{typeof error === 'object' && 'data' in error
					? String(error.data)
					: String(error)}
			</p>
		)
	}

	return (
		<div className='p-4'>
			{categoriesLoading ? (
				<ul className='w-full max-w-full max-h-[80vh] overflow-y-scroll font-medium flex-col gap-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent'>
					{Array.from({ length: 10 }).map((_, index) => (
						<li key={index} className='flex items-center gap-2 p-2'>
							<Skeleton className='size-6' />
							<Skeleton className='h-6 w-full' />
						</li>
					))}
				</ul>
			) : categoriesError ? (
				renderErrorMessage(categoriesError)
			) : (
				<ul className='flex flex-col gap-4 max-h-[80vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent'>
					{categories?.map(category => {
						const [uaName, ruName] = category.name.split('_')

						return (
							<li key={category.id} className='flex flex-col'>
								<div
									onClick={() => handleToggle(category.id)}
									className='flex items-center gap-2 p-2 bg-white rounded-md shadow hover:bg-gray-100 transition cursor-pointer'
								>
									<Link
										href={`/category/${category.slug}/products?page=1`}
										onClick={() => {
											onSelectCategory(category.id)
											closeSheet()
										}}
									>
										<p className='text-base font-medium'>
											{currentLanguage === 'UA' ? uaName : ruName}
										</p>
									</Link>
									<Button
										variant='ghost'
										className='ml-auto text-sm text-gray-600 hover:text-gray-800 focus:outline-none bg-transparent'
									>
										{expandedCategories.includes(category.id) ? (
											<ChevronUp className='size-4' />
										) : (
											<ChevronDown className='size-4' />
										)}
									</Button>
								</div>
								{expandedCategories.includes(category.id) && (
									<Subcategories
										categorySlug={category.slug}
										currentLanguage={currentLanguage}
										onSelectCategory={onSelectCategory}
										closeSheet={closeSheet}
									/>
								)}
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}

const Subcategories = ({
	categorySlug,
	currentLanguage,
	onSelectCategory,
	closeSheet,
}: {
	categorySlug: string
	currentLanguage: 'UA' | 'RU'
	onSelectCategory: (categoryId: number) => void
	closeSheet: () => void
}) => {
	const {
		data: subcategories,
		error: subcategoriesError,
		isLoading: subcategoriesLoading,
	} = useGetSubcategoriesQuery(categorySlug)

	const renderErrorMessage = (error: any) => {
		return (
			<p className='text-red-500'>
				Ошибка при загрузке подкатегорий:{' '}
				{typeof error === 'object' && 'data' in error
					? String(error.data)
					: String(error)}
			</p>
		)
	}

	return (
		<div className='ml-4'>
			{subcategoriesLoading ? (
				<ul className='w-full max-w-full max-h-[80vh] overflow-y-scroll font-medium flex-col gap-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent'>
					{Array.from({ length: 5 }).map((_, index) => (
						<li key={index} className='flex items-center gap-2 p-2'>
							<Skeleton className='size-6' />
							<Skeleton className='h-6 w-full' />
						</li>
					))}
				</ul>
			) : subcategoriesError ? (
				renderErrorMessage(subcategoriesError)
			) : (
				<ul className='flex flex-col gap-2 ml-4'>
					{subcategories?.map(subcategory => {
						const [uaName, ruName] = subcategory.name.split('_')

						return (
							<li key={subcategory.id}>
								<Link
									href={`/category/${categorySlug}/${subcategory.slug}/products?page=1`}
									onClick={() => {
										onSelectCategory(subcategory.id)
										closeSheet()
									}}
								>
									<div className='flex items-center gap-2 p-2 bg-white rounded-md shadow hover:bg-gray-100 transition cursor-pointer'>
										<p className='text-base font-medium'>
											{currentLanguage === 'UA' ? uaName : ruName}
										</p>
									</div>
								</Link>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}
