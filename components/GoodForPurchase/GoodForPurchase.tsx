"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { type Good } from "@/types/goods"
import styles from "./GoodForPurchase.module.css"
import { useBasket } from "@/stores/basketStore"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface GoodForPurchaseProps {
	good: Good
}

export default function GoodForPurchase({ good }: GoodForPurchaseProps) {
	const addGood = useBasket((state) => state.addGood)
	const router = useRouter()

	const [selectedSize, setSelectedSize] = useState<string>(good.size && good.size.length > 0 ? good.size[0] : "")

	const [selectedColor, setSelectedColor] = useState<string>(good.color && good.color.length > 0 ? good.color[0] : "")

	const [quantity, setQuantity] = useState(1)
	const [images, setImages] = useState<string[]>([])
	const [mainImage, setMainImage] = useState<string>("")

	const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false)
	const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false)

	useEffect(() => {
		const ts_setImages = async () => {
			if (good.image) {
				let imgList: string[] = []
				if (Array.isArray(good.image)) {
					imgList = good.image.map((img) => (typeof img === "object" && img.url ? img.url : img))
				} else if (typeof good.image === "string") {
					imgList = [good.image]
				}
				setImages(imgList)
				if (imgList.length > 0) {
					setMainImage(imgList[0])
				}
			}
		}
		ts_setImages()
	}, [good.image])

	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	const handleQuantityChange = (delta: number) => {
		setQuantity((prev) => Math.max(1, prev + delta))
	}

	const handleValidation = () => {
		if (good.size && good.size?.length > 0 && !selectedSize) {
			setErrorMsg("Будь ласка, оберіть розмір")
			return false
		}
		if (good.color && good.color?.length > 0 && !selectedColor) {
			setErrorMsg("Будь ласка, оберіть колір")
			return false
		}
		setErrorMsg(null)
		return true
	}

	const prepareForCheckout = () => {
		// Функція додавання товару у кошик перед переходом на чекаут
		addGood({
			id: good._id,
			quantity: quantity,
			size: selectedSize || "",
			color: selectedColor || undefined,
		})
		setQuantity(1)
	}

	// --- ЛОГІКА КНОПОК ---
	const handleAddToCart = () => {
		if (!handleValidation()) return

		prepareForCheckout()
		toast.success(`${quantity} шт. ${good.name} додано в кошик!`)
	}

	const handleBuyNow = () => {
		if (!handleValidation()) return

		prepareForCheckout()
		toast("Товар додано. Перенаправляємо на оформлення замовлення!", {
			icon: "🛒",
		})
		router.push("/order")
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const sizeBlock = document.getElementById(`size-selector-${good._id}`)
			const colorBlock = document.getElementById(`color-selector-${good._id}`)

			if (sizeBlock && !sizeBlock.contains(event.target as Node)) {
				setIsSizeDropdownOpen(false)
			}
			if (colorBlock && !colorBlock.contains(event.target as Node)) {
				setIsColorDropdownOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [good._id])

	const renderStars = (rating: number) => {
		const MAX_STARS = 5
		const fullStars = Math.floor(rating) || 0
		const hasHalfStar = rating % 1 >= 0.5
		const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0)

		const stars = []
		const starProps = { width: 20, height: 20 }

		for (let i = 0; i < fullStars; i++) {
			stars.push(<Image key={`full-${i}`} src="/svg/star-filled.svg" alt="full star" {...starProps} />)
		}

		if (hasHalfStar) {
			stars.push(<Image key="half" src="/svg/star_half.svg" alt="half star" {...starProps} />)
		}

		for (let i = 0; i < emptyStars; i++) {
			stars.push(<Image key={`empty-${i}`} src="/svg/star.svg" alt="empty star" {...starProps} />)
		}

		return stars
	}

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				{/* --- ЛІВА КОЛОНКА: ГАЛЕРЕЯ */}
				<div className={styles.gallery}>
					<div className={styles.mainImageWrapper}>
						{mainImage && (
							<Image
								src={mainImage}
								alt={good.name}
								fill
								className={styles.mainImage}
								priority
								sizes="(min-width:1440px) 40vw, (min-width:768px) 50vw, 100vw"
							/>
						)}
						{!mainImage && (
							<div
								style={{
									padding: "50%",
									textAlign: "center",
									color: "var(--color-neutral)",
								}}
							>
								Немає фото
							</div>
						)}
					</div>
					{images.length > 1 && (
						<ul className={styles.thumbnails}>
							{images.map((imgUrl, idx) => (
								<li
									key={idx}
									className={`${styles.thumbnailItem} ${mainImage === imgUrl ? styles.activeThumb : ""}`}
									onClick={() => setMainImage(imgUrl)}
								>
									<Image src={imgUrl} alt={`preview ${idx}`} width={80} height={100} className={styles.thumbImage} />
								</li>
							))}
						</ul>
					)}
				</div>

				{/* --- ПРАВА КОЛОНКА: ІНФОРМАЦІЯ --- */}
				<div className={styles.info}>
					<p className={styles.categoryPath}>
						<Link href="/goods">Всі товари</Link> &#62;{" "}
						{good.category?.name ? (
							<>
								<Link href={`/goods?category=${good.category._id}`}>{good.category.name}</Link> &#62;{" "}
							</>
						) : (
							"Каталог"
						)}
						<span className={styles.span}>{good.name}</span>
					</p>

					<h1 className={styles.title}>{good.name}</h1>

					<div className={styles.meta}>
						<span className={styles.price}>
							{good.price} {good.currency || "₴"}
						</span>
						<div className={styles.rating}>
							{renderStars(good.averageRating || 0)}
							<span>({good.averageRating || 0})</span> •
							<span className={styles.reviewsCount}>{good.feedbackCount || 0} відгуків</span>
						</div>
					</div>

					{good.prevDescription && <p className={styles.shortDescription}>{good.prevDescription}</p>}
					{/* // Cелектор кольору // */}
					<div className={styles.selectorsStyles}>
						{good.color && good.color.length > 0 && (
							<div className={styles.selectorBlock}>
								<p className={styles.selectorTitle}>Колір</p>

								<div
									className={`${styles.selectDropdown} ${styles.colorDropdown} ${
										isColorDropdownOpen ? styles.arrowUp : ""
									}`}
									onClick={() => {
										setIsColorDropdownOpen(!isColorDropdownOpen)
										if (isSizeDropdownOpen) setIsSizeDropdownOpen(false)
									}}
								>
									<p className={styles.selectedValueDisplay}>{selectedColor || good.color[0]}</p>
									<Image
										src="/svg/keyboard_arrow_down.svg"
										alt="Select arrow"
										width={24}
										height={24}
										className={`${styles.dropdownArrow} ${isColorDropdownOpen ? styles.arrowUp : ""}`}
									/>
								</div>

								{isColorDropdownOpen && (
									<ul className={styles.customOptionsList}>
										{good.color.map((color) => (
											<li
												key={color}
												className={styles.customOptionItem}
												onClick={() => {
													setSelectedColor(color)
													setIsColorDropdownOpen(false)
													setErrorMsg(null)
												}}
											>
												{color}
											</li>
										))}
									</ul>
								)}
							</div>
						)}
						{/* Селектор розміру */}
						{good.size && good.size.length > 0 && (
							<div className={styles.selectorBlock} id={`size-selector-${good._id}`}>
								<p className={styles.selectorTitle}>Розмір</p>

								<div
									className={`${styles.selectDropdown} ${styles.sizeDropdown} ${
										isSizeDropdownOpen ? styles.openDropdown : ""
									}`}
									onClick={() => {
										setIsSizeDropdownOpen(!isSizeDropdownOpen)
										if (isColorDropdownOpen) setIsColorDropdownOpen(false)
									}}
								>
									<p className={styles.selectedValueDisplay}>{selectedSize || good.size[0]}</p>
									<Image
										src="/svg/keyboard_arrow_down.svg"
										alt="Select arrow"
										width={24}
										height={24}
										className={`${styles.dropdownArrow} ${isSizeDropdownOpen ? styles.arrowUp : ""}`}
									/>
								</div>

								{isSizeDropdownOpen && (
									<ul className={styles.customOptionsList}>
										{good.size.map((size) => (
											<li
												key={size}
												className={styles.customOptionItem}
												onClick={() => {
													setSelectedSize(size)
													setIsSizeDropdownOpen(false)
													setErrorMsg(null)
												}}
											>
												{size}
											</li>
										))}
									</ul>
								)}
							</div>
						)}

						{errorMsg && <p className={styles.error}>{errorMsg}</p>}
						<div className={styles.btnSection}>
							<button className={styles.addToCartBtn} onClick={handleAddToCart}>
								Додати в кошик
							</button>
							<div className={styles.purchaseActions}>
								<button
									className={styles.quantityBtn}
									onClick={() => handleQuantityChange(-1)}
									disabled={quantity <= 1}
								>
									-
								</button>
								<span className={styles.quantityDisplay}>{quantity}</span>
								<button className={styles.quantityBtn} onClick={() => handleQuantityChange(1)}>
									+
								</button>
							</div>
						</div>
						<button className={styles.buyNowBtn} onClick={handleBuyNow}>
							Купити зараз
						</button>
						<p className={styles.detailContentDelivery}>Безкоштовна доставка від 1000 грн.</p>
					</div>

					<div className={styles.details}>
						{(good.description?.trim().length > 0 || good.characteristics?.length > 0) && (
							<>
								<div className={styles.detailSummary}>Опис</div>

								<div className={styles.detailContent}>
									{good.description && good.description.trim().length > 0 && (
										<div className={styles.descriptionText}>
											{good.description.split("\n\n").map((paragraph, index) => (
												<p key={index} className={styles.descriptionParagraph}>
													{paragraph.split("\n").map((line, lineIndex) => (
														<React.Fragment key={lineIndex}>
															{line}
															{lineIndex < paragraph.split("\n").length - 1 && <br />}
														</React.Fragment>
													))}
												</p>
											))}
											{good.description}
										</div>
									)}

									{good.characteristics && good.characteristics.length > 0 && (
										<>
											<p className={styles.characteristicsTitle}>Основні характеристики</p>
											<ul className={styles.characteristicsList}>
												{good.characteristics.map((char, index) => (
													<li className={styles.characteristicsList} key={index}>
														{char}
													</li>
												))}
											</ul>
										</>
									)}

									{!good.description && !good.characteristics?.length && <p>Детальний опис відсутній.</p>}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
