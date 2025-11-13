export default function GoodsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="layout">
			<main>{children}</main>
		</div>
	)
}
