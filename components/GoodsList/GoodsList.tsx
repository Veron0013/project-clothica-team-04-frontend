"use client"

import { motion, AnimatePresence } from "framer-motion"
import styles from "./GoodsList.module.css"
import Image from "next/image"
import Link from "next/link"
import { Good } from "@/types/goods"

type Props = {
	items: Good[] // что рендерим
}

export function GoodsList({ items }: Props) {
	return (
		<ul className={styles.list}>
			<AnimatePresence>
				{items.map((item) => (
					<motion.li
						key={item._id}
						className={styles.item}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.35, ease: "easeOut" }}
						layout // плавне переміщення елементів при зміні кількості
					>
						<article className={styles.card} role="article" aria-label={item.name}>
							<div className={styles.cardImgWrap} style={{ position: "relative" }}>
								<Image
									src={item.image}
									alt={item.name}
									fill
									sizes="(min-width:1440px) 25vw, (min-width:768px) 25vw, 50vw"
									className={styles.cardImg}
									priority={false}
								/>
							</div>

							<div className={styles.cardBody}>
								<div className={styles.cardTop}>
									<h3 className={styles.cardTitle}>{item.name}</h3>
									<span className={styles.cardPrice}>{item.price} грн</span>
								</div>

								<div className={styles.metaRow} aria-label="рейтинг та відгуки">
									<span className={styles.metaStat}>★ {item.averageRating ?? 5}</span>
									<span className={styles.metaDot} aria-hidden="true">
										•
									</span>
									<span className={styles.metaStat}>{item.feedbackCount ?? 2}</span>
								</div>

								<Link href={`/goods/${item._id}`} className={styles.cardCta}>
									Детальніше
								</Link>
							</div>
						</article>
					</motion.li>
				))}
			</AnimatePresence>
		</ul>
	)
}
