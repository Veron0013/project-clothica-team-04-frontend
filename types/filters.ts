import { GoodCategory } from "./goods"

export type AllFilters = {
	categories?: GoodCategory[]
	colors?: string[]
	genders?: string[]
	sizes?: string[]
	fromPrice?: number
	toPrice?: number
}
