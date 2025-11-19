"use client"

import { ScaleLoader } from "react-spinners"
import css from "./Loader.module.css"
import type { CSSProperties } from "react"
import { LOADING_MAIN_MESSAGE } from "@/lib/vars"

const Loading = () => {
	const override: CSSProperties = {
		display: "block",
		margin: "0 auto",
		borderColor: "#17862c",
	}

	//console.log("load")

	return (
		<div className={css.wrapper}>
			<ScaleLoader
				color="#17862c"
				loading={true}
				cssOverride={override}
				//size={150}
				aria-label="Loading...."
				data-testid="loader"
			/>
			<span className={css.text}>{LOADING_MAIN_MESSAGE}</span>
		</div>
	)
}

export default Loading
