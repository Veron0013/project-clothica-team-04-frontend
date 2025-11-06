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
	title: "Clothica - purchase App",
	description: "Find your own style",
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
