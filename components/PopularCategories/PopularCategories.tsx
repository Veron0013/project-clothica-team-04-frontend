"use client"
import css from "./PopularCategories.module.css"
import Link from "next/link"
import { useRef, useState } from "react"
import { type GoodCategory } from "@/types/goods"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperType } from "swiper"
import { Navigation, Keyboard, Pagination } from "swiper/modules"

import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { fetchPopularCategories } from "@/lib/api/mainPageApi"

type PopularCategoriesProps = {
	initialData: {
		categories: GoodCategory[]
		page: number
		totalPages: number
	}
}

export default function PopularCategories({ initialData }: PopularCategoriesProps) {
	const [categories, setPopularCategories] = useState<GoodCategory[]>(initialData.categories)
	const [page, setPage] = useState(1)
	const [isLoadingMore, setIsLoadingMore] = useState(false)

	const totalPages = initialData.totalPages
	const hasMore = page < totalPages

	const swiperRef = useRef<SwiperType | null>(null)

	const [isBeginning, setIsBeginning] = useState(true)
	const [isEnd, setIsEnd] = useState(false)

	const isPrevDisabled = isBeginning
	const isNextDisabled = isEnd && !hasMore

	const handlePrev = () => {
		if (!swiperRef.current) return
		swiperRef.current.slidePrev()
	}

	const handleNext = async () => {
		const swiper = swiperRef.current
		if (!swiper) return

		const atEnd = swiper.isEnd
		if (atEnd && hasMore && !isLoadingMore) {
			setIsLoadingMore(true)
			try {
				const nextPage = page + 1
				const data = await fetchPopularCategories({
					page: nextPage,
					limit: 3,
				})
				setPopularCategories((prev) => [...prev, ...data.categories])
				setPage(nextPage)
			} catch (error) {
				console.error(error)
			} finally {
				setIsLoadingMore(false)
			}
		}
		swiper.slideNext()
	}

	return (
		<section id="popular-categories" className={css.categories}>
			<div className={css.container}>
				<div className={css.nav}>
					<h2 className={css.title}>Популярні категорії</h2>
					<Link href="/categories" className={css.allCatBtn}>
						Всі категорії
					</Link>
				</div>
				<div className={css.sliderWrapper}>
					<Swiper
						modules={[Navigation, Keyboard, Pagination]}
						onBeforeInit={(swiper) => {
							swiperRef.current = swiper
						}}
						onSlideChange={(swiper) => {
							setIsBeginning(swiper.isBeginning)
							setIsEnd(swiper.isEnd)
						}}
						keyboard={{ enabled: true }}
						spaceBetween={32}
						slidesPerView={1}
						breakpoints={{
							768: { slidesPerView: 2 },
							1440: { slidesPerView: 3 },
						}}
						pagination={{
							clickable: true,
							el: ".popularPagination",
						}}
						className={css.swiper}
					>
						{categories.map((cat) => (
							<SwiperSlide key={cat._id}>
								<div className={css.thumb}>
									<Image
										src={cat.image}
										alt={cat.name}
										fill
										sizes="(min-width:1440px) 100vw, (min-width:768px) 100vw, 100vw"
										className={css.img}
									/>
								</div>
								<h3 className={css.cardTitle}>{cat.name}</h3>
							</SwiperSlide>
						))}
					</Swiper>
					<div className={css.controls}>
						<div className={`popularPagination ${css.pagination}`}></div>
						<button
							type="button"
							className={`${css.navBtn} ${css.navPrev} ${isPrevDisabled ? css.navBtnDisabled : ""}`}
							onClick={handlePrev}
							disabled={isPrevDisabled}
							aria-label="Попередні товари"
						>
							<svg className={css.icon} width={24} height={24}>
								<use href="/sprite.svg/#arrow_back"></use>
							</svg>
						</button>
						<button
							type="button"
							className={`${css.navBtn} ${css.navNext} ${isNextDisabled ? css.navBtnDisabled : ""}`}
							onClick={handleNext}
							disabled={isNextDisabled || isLoadingMore}
							aria-label="Наступні товари"
						>
							<svg className={css.icon} width={24} height={24}>
								<use href="/sprite.svg/#arrow_forward"></use>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
