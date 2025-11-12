"use client"

import styles from "./GoodsList.module.css"
import Image from "next/image"
import Link from "next/link"
import { Good } from "@/types/goods"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
	items: Good[] // что рендерим
}

export function GoodsList({ items }: Props) {
	return (
		<ul className={styles.list}>
			<AnimatePresence>
				{items.map((item: Good, index: number) => (
					<li key={item._id} id={item._id.toString()} style={{ animationDelay: `${index * 100}ms` }}>
						<article className={styles.card} role="article" aria-label={item.name}>
							<div className={styles.cardImgWrap} style={{ position: "relative" }}>
								<Image
									src={item.image}
									alt={item.name}
									fill
									sizes="(min-width:1440px) 25vw, (min-width:768px) 25vw, 50vw"
									className={styles.cardImg}
									loading="lazy"
								/>
							</div>

							<div className={styles.cardBody}>
								<div className={styles.cardTop}>
									<h3 className={styles.cardTitle}>{item.name}</h3>
								</div>

								<div className={styles.metaRow} aria-label="рейтинг та відгуки">
									<div className={styles.metaRowInner}>
										<svg width="16" height="16">
											<use href="/sprite.svg#star-filled" />
										</svg>
										<span className={styles.metaStat}>{item.averageRating ?? 0}</span>
									</div>
									<div className={styles.metaRowInner}>
										<svg width="16" height="16">
											<use href="/sprite.svg#feedbacks" />
										</svg>
										<span className={styles.metaStat}>{item.feedbackCount ?? 2}</span>
									</div>
								</div>

								<div className={styles.cardPrice}>
									{item.price} {item.currency}
								</div>
							</div>

							<Link href={`/goods/${item._id}`} className={styles.cardCta}>
								Детальніше
							</Link>
						</article>
					</li>
				))}
			</AnimatePresence>
		</ul>
	)
}
