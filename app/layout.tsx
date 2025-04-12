import Providers from '@/components/Providers'
import { Ad, Footer, Header } from '@/components/shared'
import { MobileMenu } from '@/components/shared/header/mobile-menu'
import type { Metadata } from 'next'
import { Montserrat as FontSans } from 'next/font/google'
import './globals.css'
import i18n from '@/lib/i18n/i18n'
import { Suspense } from 'react'
import { Loading } from '@/components/Loading'

const fontSans = FontSans({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-sans',
})

export const metadata: Metadata = {
	title: 'Тера Меблі',
	description: 'Інтернет магазин меблів',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang={'uk'}>
			<body className={`${fontSans.variable}`}>
				<Ad />
				<Suspense fallback={<Loading />}>
					<Providers>
						<Header />
						<main className='main'>{children}</main>
						<Footer />
						<MobileMenu />
					</Providers>
				</Suspense>
			</body>
		</html>
	)
}
