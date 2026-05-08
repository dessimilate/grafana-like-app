import type {
	NextComponentType as NCT,
	NextPageContext
} from 'next/dist/shared/lib/utils'

export type NextComponentType<T = object> = NCT<NextPageContext, {}, T>
