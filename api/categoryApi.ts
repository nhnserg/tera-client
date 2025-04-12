import { CartItem, OrderFormData } from '@/types/cart'
import { Category, CategoryWithProducts, Product } from '@/types/redux'
import { Review, ReviewForm } from '@/types/review'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  // baseQuery: fetchBaseQuery({  baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3005/api' }),
  endpoints: builder => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => '/category',
    }),

    getSubcategories: builder.query<Category[], string>({
      query: slug => `/category/${slug}/sub`,
    }),

    getCategoryWithProducts: builder.query<CategoryWithProducts, any>({
      query: ({
        slug,
        page = 1,
        limit = 12,
        location = 'mebliPervomaisk',
        sortField,
        sortOrder,
        ...filters
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          location,
          ...(sortField && { sortField }),
          ...(sortOrder && { sortOrder }),
          ...filters,
        })
        return `category/${slug}/products?${params}`
      },
    }),

    getProductsForSubcategory: builder.query<CategoryWithProducts, any>({
      query: ({
        slug,
        subcategorySlug,
        page = 1,
        limit = 12,
        location = 'mebliPervomaisk',
        sortField,
        sortOrder,
        ...filters
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          location,
          ...(sortField && { sortField }),
          ...(sortOrder && { sortOrder }),
          ...filters,
        })
        return `category/${slug}/${subcategorySlug}/products?${params}`
      },
    }),
    fetchProductById: builder.query<
      Product,
      {
        slug: string
        subcategorySlug: string
        offerId: string
      }
    >({
      query: ({ slug, subcategorySlug, offerId }) =>
        `category/${slug}/${subcategorySlug}/product/${offerId}`,
    }),

    searchProducts: builder.query<
      {
        results: Product[]
        total: number
        totalPages: number
        currentPage: number
      },
      {
        info: string
        page: number
        limit: number
        location: string
        filters?: Record<string, string | number>
        sortField?: string
        sortOrder?: 'asc' | 'desc'
      }
    >({
      query: ({
        info,
        page,
        limit,
        location,
        filters = {},
        sortField = 'RetailPrice',
        sortOrder = 'asc',
      }) => {
        const baseUrl = `/search/${location}?info=${info}&page=${page}&limit=${limit}`
        const sortParams = `&sortField=${sortField}&sortOrder=${sortOrder}`
        const filterParams = Object.entries(filters)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
        return baseUrl + sortParams + (filterParams ? `&${filterParams}` : '')
      },
      transformResponse: (response: {
        results: Product[]
        totalSearch: number
        totalPages: number
        currentPage: number
      }) => ({
        results: response.results,
        total: response.totalSearch,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      }),
    }),
    submitOrder: builder.mutation<
      void,
      { form: OrderFormData; cartItems: CartItem[]; total: number }
    >({
      query: ({ form, cartItems, total }) => ({
        url: '/order',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form,
          cartItems,
          total,
        }),
      }),
    }),
    addProductReview: builder.mutation<void, Review>({
      query: ({ offerId, name, review }) => ({
        url: '/reviews',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerId,
          name,
          review,
        }),
      }),
    }),
    fetchReviewsByOfferId: builder.query<ReviewForm[], string>({
      query: offerId => `/reviews/${offerId}`,
      transformResponse: (response: { reviews: ReviewForm[] }) =>
        response.reviews,
    }),
  }),
})

export const {
  useGetAllCategoriesQuery,
  useGetSubcategoriesQuery,
  useGetCategoryWithProductsQuery,
  useGetProductsForSubcategoryQuery,
  useFetchProductByIdQuery,
  useSearchProductsQuery,
  useSubmitOrderMutation,
  useAddProductReviewMutation,
  useFetchReviewsByOfferIdQuery,
} = categoryApi
