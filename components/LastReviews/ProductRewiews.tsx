"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Keyboard, A11y, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import css from "./LastReviews.module.css"
import { Feedback } from "@/lib/productsServise"
import StarRating from "../StarRating/StarRating"

interface Props {
	reviews: Feedback[]
}

export default function ProductRewiews({ reviews }: Props) {
	const noData = reviews.length === 0

	return (
		<>
			<div className={css.container}>
				{noData ? (
					
					<p>Не вдалося отримати відгуки </p>
				) : (
					<Swiper
						modules={[Navigation, Keyboard, A11y, Autoplay]}
						keyboard={{ enabled: true }}
						spaceBetween={34}
						slidesPerView={1}
						slidesPerGroup={1}
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
						}}
						breakpoints={{
							768: { slidesPerView: 2, slidesPerGroup: 2 },
							1440: { slidesPerView: 3, slidesPerGroup: 3 },
						}}
						className={css.swiper}
						a11y={{ enabled: true }}
					>
						{reviews.map((item, i) => (
							<SwiperSlide key={item._id || i} className={css.item}>
								<div className={css.stars}>
									<StarRating rate={item.rate || 0} />
								</div>

								<p className={css.text}>{item.description || ""}</p>
								<p className={css.name}>{item.author || "Анонім"}</p>
							</SwiperSlide>
						))}
					</Swiper>
				)}

			</div>
		</>
	)
}