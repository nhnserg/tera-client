export interface Category {
	id: number
	name: string
	slug: string
}

export interface ProductParams {
	subcategoryId: number
	[key: string]: any // Для динамических ключей
}

export interface Product {
	offerId: string
	[key: string]: any // Для динамических параметров
}

export interface Subcategory {
	subcategory: {
		id: number
		name: string
		slug: string
	}
	products: Product[]
}

export interface CategoryResponse {
	category: Category
	products: Product[]
	subcategories: Subcategory[]
	totalProducts: number
	totalPages: number
	currentPage: number
}
