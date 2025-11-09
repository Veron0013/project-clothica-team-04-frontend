import Image from "next/image"

export default function Categories() {
	return (
		<div className="flex min-h-screen items-center justify-center font-sans bg-(--background)">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-(--background) sm:items-start">
				<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
					<h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
						Знайди свій стиль з Clothica вже сьогодні!
					</h1>
					<p className="max-w-md text-lg leading-8 text-foreground">
						Clothica — це місце, де комфорт поєднується зі стилем. Ми створюємо базовий одяг, який легко комбінується та
						підходить для будь-якої нагоди. Обирай речі, що підкреслять твою індивідуальність і завжди будуть
						актуальними.
					</p>
				</div>
				<div className="flex flex-col gap-4 text-base font-medium sm:flex-row pb-40">
					<a
						className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-background px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Deploy Now
					</a>
					<a
						className="flex h-12 w-full items-center justify-center rounded-full border border-solid bg-(--main-theme-light) text-(--main-color-ligth) px-5 transition-colors hover:border-transparent hover:bg-amber-300/4 dark:border-white/[.145] dark:hover:bg-amber-300 md:w-[158px]"
						href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Documentation
					</a>
				</div>
			</main>
		</div>
	)
}
