'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowDownUp, Filter } from 'lucide-react'

import { CrumbsLinks } from '@/components/shared/CrumbsLinks'
import Pagination from '@/components/shared/Pagination'
import { AppliedFiltersAccord } from '@/components/shared/product/appliedFilters'
import { ProductFilter } from '@/components/shared/product/ProductFilter'
import { ProductPriceFilter } from '@/components/shared/product/ProductPriceFilter'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

import { useProductFilters } from '@/hooks/product/useProductFilters'
import { Product } from '@/types/redux'
import { useGetProductsForSubcategoryQuery } from '@/api/categoryApi'
import { ProductCard } from '@/components/shared/product/ProductCart'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { NoResults } from '@/components/shared/no-results'

type PopularFilterProps = {
  className?: string
  onSortChange: (sortField: string, sortOrder: string) => void
}

const PopularFilter = ({ className, onSortChange }: PopularFilterProps) => {
  const sortOptions = [
    { label: 'Від дорогих', sortField: 'RetailPrice', sortOrder: 'desc' },
    { label: 'Від дешевих', sortField: 'RetailPrice', sortOrder: 'asc' },
  ]

  return (
    <div className={className}>
      {sortOptions.map((option, index) => (
        <Button
          key={index}
          variant='outline'
          className='h-7 px-3 py-1'
          onClick={() => onSortChange(option.sortField, option.sortOrder)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

const FilterSection = ({
  showAppliedFilters,
  minMaxPrices,
  minPrice,
  maxPrice,
  selectedAttributes,
  sortField,
  sortOrder,
  products,
  handleApplyPriceFilter,
  handleAttributeFilter,
  resetFilters,
  className,
}: {
  showAppliedFilters: boolean
  minMaxPrices: { minPrice: number; maxPrice: number } | undefined
  minPrice: number | undefined
  maxPrice: number | undefined
  selectedAttributes: Record<string, (string | number)[]>
  sortField?: string
  sortOrder?: string
  products: Product[]
  handleApplyPriceFilter: (min: number, max: number) => void
  handleAttributeFilter: (filters: Record<string, (string | number)[]>) => void
  resetFilters: () => void
  className?: string
}) => (
  <div className={className}>
    {showAppliedFilters &&
      (minPrice ||
        maxPrice ||
        Object.keys(selectedAttributes).length > 0 ||
        sortField) && (
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
        minPrice={Number(minMaxPrices?.minPrice)}
        maxPrice={Number(minMaxPrices?.maxPrice)}
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

export default function CategoryPageWithSubcategory({
  params,
}: {
  params: { slug: string; subcategorySlug: string }
}) {
  const { slug, subcategorySlug } = params
  const router = useRouter()
  const searchParams = useSearchParams()

  const { storage } = useSelector((state: RootState) => state.selectedStorage)

  const queryParams = Object.fromEntries(searchParams.entries())
  const {
    page = '1',
    limit = '12',
    location = storage,
    sortField,
    sortOrder = 'asc',
    ...filters
  } = queryParams

  const [filtersState, setFiltersState] = useState<{
    minPrice?: number
    maxPrice?: number
    selectedAttributes: Record<string, (string | number)[]>
    sortField?: string
    sortOrder: string
    showAppliedFilters: boolean
  }>({
    minPrice: undefined,
    maxPrice: undefined,
    selectedAttributes: {},
    sortField: 'desc',
    sortOrder: 'asc',
    showAppliedFilters: false,
  })

  const { data, isLoading, isError } = useGetProductsForSubcategoryQuery({
    slug,
    subcategorySlug,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    location: storage,
    sortField,
    sortOrder,
    ...filters,
  })

  const handleApplyPriceFilter = (min: number, max: number) => {
    setFiltersState(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
      showAppliedFilters: true,
    }))
    router.push(
      `/category/${slug}/${subcategorySlug}/products?${new URLSearchParams({
        ...queryParams,
        minPrice: String(min),
        maxPrice: String(max),
      }).toString()}`,
    )
  }

  const handleAttributeFilter = (
    selectedFilters: Record<string, (string | number)[]>,
  ) => {
    const updatedQueryParams = {
      ...queryParams,
      ...Object.fromEntries(
        Object.entries(selectedFilters).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : String(value),
        ]),
      ),
      page: '1',
    }

    const queryString = new URLSearchParams(updatedQueryParams).toString()

    router.push(`/category/${slug}/${subcategorySlug}/products?${queryString}`)
  }

  const resetFilters = () => {
    setFiltersState({
      minPrice: undefined,
      maxPrice: undefined,
      selectedAttributes: {},
      sortField: undefined,
      sortOrder: 'asc',
      showAppliedFilters: false,
    })

    const resetQueryParams = {
      page: '1',
      limit: '12',
      location: storage,
    }

    router.push(
      `/category/${slug}/${subcategorySlug}/products?${new URLSearchParams(
        resetQueryParams,
      ).toString()}`,
    )
  }

  const handlePageChange = (page: number) => {
    router.push(
      `/category/${slug}/${subcategorySlug}/products?${new URLSearchParams({
        ...queryParams,
        page: String(page),
      }).toString()}`,
    )
  }

  const handleSortChange = (newSortField: string, newSortOrder: string) => {
    setFiltersState(prev => ({
      ...prev,
      sortField: newSortField,
      sortOrder: newSortOrder,
      showAppliedFilters: true,
    }))
    router.push(
      `/category/${slug}/${subcategorySlug}/products?${new URLSearchParams({
        ...queryParams,
        sortField: newSortField,
        sortOrder: newSortOrder,
        page: '1',
      }).toString()}`,
    )
  }

  const filteredAndSortedProducts = useProductFilters(data?.products || [], {
    minPrice: filtersState.minPrice,
    maxPrice: filtersState.maxPrice,
    attributes: filtersState.selectedAttributes,
  })

  if (isLoading) {
    return <p className='text-gray-500'>Завантаження...</p>
  }

  if (isError || !data) {
    return <p className='text-red-500'>Помилка завантаження даних</p>
  }

  return (
    <div>
      <div className='flex items-center justify-center gap-8 py-4 xl:hidden'>
        <Dialog>
          <DialogTrigger className='flex items-center'>
            <Filter />
            Фільтри
          </DialogTrigger>
          <DialogContent className='h-screen overflow-y-auto p-2'>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <FilterSection
              className='hidden max-w-[280px] flex-col gap-2 sm:min-w-[280px] xl:flex'
              showAppliedFilters={filtersState.showAppliedFilters}
              minMaxPrices={data?.minMaxPrices}
              minPrice={filtersState.minPrice || data?.minMaxPrices?.minPrice}
              maxPrice={filtersState.maxPrice || data?.minMaxPrices?.maxPrice}
              selectedAttributes={filtersState.selectedAttributes}
              sortField={filtersState.sortField}
              sortOrder={filtersState.sortOrder}
              products={data.products}
              handleApplyPriceFilter={handleApplyPriceFilter}
              handleAttributeFilter={handleAttributeFilter}
              resetFilters={resetFilters}
            />
          </DialogContent>
        </Dialog>

        <p className='flex'>
          <ArrowDownUp />
          Сортування
        </p>
      </div>

      <div className='mb-[75px]'>
        <div className='relative flex'>
          <CrumbsLinks
            сategory={{
              name: data.parentCategory.name,
              slug,
            }}
            subcategory={{
              name: data.subcategory.name,
              subcategorySlug,
            }}
            currentPage='subcategory'
          />
          <PopularFilter
            onSortChange={handleSortChange}
            className='absolute right-0 hidden translate-y-full gap-4 xl:flex'
          />
        </div>
        <div className='flex flex-col gap-8 md:flex-row md:justify-between'>
          <FilterSection
            className='hidden max-w-[280px] flex-col gap-2 sm:min-w-[280px] xl:flex'
            showAppliedFilters={filtersState.showAppliedFilters}
            minMaxPrices={data?.minMaxPrices}
            minPrice={filtersState.minPrice || data?.minMaxPrices?.minPrice}
            maxPrice={filtersState.maxPrice || data?.minMaxPrices?.maxPrice}
            selectedAttributes={filtersState.selectedAttributes}
            sortField={filtersState.sortField}
            sortOrder={filtersState.sortOrder}
            products={data.products}
            handleApplyPriceFilter={handleApplyPriceFilter}
            handleAttributeFilter={handleAttributeFilter}
            resetFilters={resetFilters}
          />
          <div className='products-content-wrapper'>
            {filteredAndSortedProducts.length > 0 ? (
              <ul className='product-list'>
                {filteredAndSortedProducts.map((product: Product) => (
                  <li key={product.offerId}>
                    <ProductCard
                      product={product}
                      slug={slug}
                      subcategorySlug={subcategorySlug}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <NoResults />
            )}
            <Pagination
              currentPage={data.currentPage || 1}
              totalPages={data.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
