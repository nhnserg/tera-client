import { ChevronDown } from 'lucide-react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useGetSubcategoriesQuery } from '@/api/categoryApi'
import { Button } from '../ui'

interface BreadcrumbProps {
	сategory?: {
		name: string
		slug: string
	}
	subcategory?: {
		name: string
		subcategorySlug: string
	}
	productName?: string
	customBreadcrumb?: Array<{ name: string; url?: string }>
	homeLinkLabel?: string
	homeLinkUrl?: string
	currentPage?: 'category' | 'subcategory' | 'product' | 'search'
	subcategories?: Array<{ name: string; subcategorySlug: string }>
}

export function CrumbsLinks({
	сategory,
	subcategory,
	productName,
	customBreadcrumb,
	homeLinkLabel = 'Головна',
	homeLinkUrl = '/',
	currentPage,
}: BreadcrumbProps) {
	const trimName = (name: string) => name.split('_')[0]

	// Подкатегории фетчатся только если не на странице поиска
	const { data: subcategories } =
		currentPage !== 'search' && сategory?.slug
			? useGetSubcategoriesQuery(сategory.slug)
			: { data: undefined }

	return (
		<Breadcrumb className='py-7'>
			<BreadcrumbList className='text-lg flex items-center'>
				<BreadcrumbItem className='flex items-center'>
					<BreadcrumbLink asChild>
						<Link href={homeLinkUrl}>
							<span className='flex items-center'>{homeLinkLabel}</span>
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{customBreadcrumb &&
					customBreadcrumb.map((item, index) => (
						<div key={index}>
							<BreadcrumbItem className='text-xl'>
								{item.url ? (
									<BreadcrumbLink asChild>
										<Link href={item.url}>{item.name}</Link>
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage className='text-xl font-bold'>
										{item.name}
									</BreadcrumbPage>
								)}
							</BreadcrumbItem>
							{index < customBreadcrumb.length - 1 && <BreadcrumbSeparator />}
						</div>
					))}
				{сategory && (
					<>
						<BreadcrumbItem className='text-xl flex items-center'>
							{currentPage === 'category' ? (
								<BreadcrumbPage className='text-xl font-bold flex items-center gap-1'>
									{trimName(сategory.name)}
								</BreadcrumbPage>
							) : (
								<Link
									href={`/category/${сategory.slug}/products?page=1`}
									className='flex items-center gap-1'
								>
									{trimName(сategory.name)}
								</Link>
							)}
							{currentPage !== 'search' && subcategories && (
								<DropdownMenu>
									<DropdownMenuTrigger className='outline-none' asChild>
										<Button
											variant='ghost'
											className='w-5 outline-none'
											aria-label='Открыть подкатегории'
											size='icon'
										>
											<ChevronDown size={16} className='outline-none' />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align='start'
										className='bg-white shadow-md rounded p-2'
									>
										{subcategories.map(subcat => (
											<DropdownMenuItem key={subcat.slug}>
												<BreadcrumbLink asChild>
													<Link
														href={`/category/${сategory.slug}/${subcat.slug}/products?page=1`}
													>
														{trimName(subcat.name)}
													</Link>
												</BreadcrumbLink>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</BreadcrumbItem>
						{subcategory && <BreadcrumbSeparator />}
					</>
				)}
				{subcategory && (
					<>
						<BreadcrumbItem className='text-xl'>
							{currentPage === 'subcategory' ? (
								<BreadcrumbPage className='text-xl font-bold'>
									{trimName(subcategory.name)}
								</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<Link
										href={`/category/${сategory?.slug}/${subcategory.subcategorySlug}/products?page=1`}
									>
										{trimName(subcategory.name)}
									</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{productName && <BreadcrumbSeparator />}
					</>
				)}
				{productName && (
					<BreadcrumbItem>
						<BreadcrumbPage className='text-xl font-bold'>
							{productName}
						</BreadcrumbPage>
					</BreadcrumbItem>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
