import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "ftp.goit.study",
			},
			{
				protocol: "https",
				hostname: "*cloudinary.com",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "https://clothica-team-04-backend.onrender.com/:path*", // твій бекенд
			},
		]
	},
}

export default nextConfig
