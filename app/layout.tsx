import type { Metadata } from "next"
import { Inter, Nunito_Sans } from "next/font/google"
import "./globals.css"

const interSans = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
})

const nunitoSans = Nunito_Sans({
	variable: "--font-nunito-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Clothica - best clothers",
	description: "Find your own style today",
	openGraph: {
		title: `Clothica - best clothers`,
		description: "Find your own style today",
		url: `https://movieDB.com`,
		siteName: "Clothica",
		images: [
			{
				url: "https://ac.goit.global/fullstack/react/movie DB-og-meta.jpg",
				width: 1200,
				height: 630,
				alt: "Clothica",
			},
		],
		type: "website",
	},
	icons: {
		icon: "/favicon.svg",
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${interSans.variable} ${nunitoSans.variable} antialiased`}>{children}</body>
		</html>
	)
}
