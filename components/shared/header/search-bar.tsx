'use client'

import { Input, Button } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setQuery } from '@/store/searchSlice'
import { Search, XCircle } from 'lucide-react'

export const SearchBar = ({
	search: { isMobileSearchVisible, toggleSearchInput, inputRef, handleKeyDown },
}: any) => {
	const dispatch = useDispatch()
	const router = useRouter()
	const query = useSelector((state: any) => state.search.query)

	const [suggestions, setSuggestions] = useState<string[]>([])
	const [savedQueries, setSavedQueries] = useState<string[]>([])
	const [isSuggestionsVisible, setIsSuggestionsVisible] =
		useState<boolean>(false)

	const suggestionsRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const saved = JSON.parse(localStorage.getItem('searchQueries') || '[]')
		setSavedQueries(saved)
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target as Node)
			) {
				setIsSuggestionsVisible(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const saveQuery = (newQuery: string) => {
		const updatedQueries = Array.from(
			new Set([newQuery, ...savedQueries])
		).slice(0, 10)
		localStorage.setItem('searchQueries', JSON.stringify(updatedQueries))
		setSavedQueries(updatedQueries)
	}

	const handleInputChange = (value: string) => {
		dispatch(setQuery(value))
		setSuggestions(
			savedQueries.filter(q => q.toLowerCase().includes(value.toLowerCase()))
		)
		setIsSuggestionsVisible(true)
	}

	const handleSearch = () => {
		if (query) {
			saveQuery(query)
			router.push(`/search?search=${query}&page=1`)
			setSuggestions([])
			setIsSuggestionsVisible(false)
		}
	}

	const clearSavedQueries = () => {
		localStorage.removeItem('searchQueries')
		setSavedQueries([])
		setSuggestions([])
	}

	return (
		<div className='sidebar relative'>
			<div className='sidebar-container mobile'>
				{isMobileSearchVisible ? (
					<>
						<Input
							ref={inputRef}
							type='text'
							value={query}
							onChange={e => handleInputChange(e.target.value)}
							onKeyDown={e => {
								handleKeyDown(e)
								if (e.key === 'Enter') handleSearch()
							}}
							placeholder='Пошук...'
							autoFocus
							className='sidebar-input'
						/>
						<Button
							variant='ghost'
							size='icon'
							className='sidebar-button'
							onClick={handleSearch}
						>
							<Search />
						</Button>

						{isSuggestionsVisible && suggestions.length > 0 && (
							<div
								ref={suggestionsRef}
								className='absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10'
							>
								{suggestions.map((suggestion, index) => (
									<div
										key={index}
										className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
										onClick={() => {
											dispatch(setQuery(suggestion))
											setSuggestions([])
											setIsSuggestionsVisible(false)
										}}
									>
										{suggestion}
									</div>
								))}
								{savedQueries.length > 0 && (
									<div
										className='px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
										onClick={clearSavedQueries}
									>
										<XCircle className='w-5 h-5' />
										<span>Очистити історію пошуку</span>
									</div>
								)}
							</div>
						)}
					</>
				) : (
					<Button
						variant='ghost'
						size='icon'
						className='sidebar-button'
						onClick={toggleSearchInput}
					>
						<Search />
					</Button>
				)}
			</div>

			<div className='sidebar-container desktop'>
				<Input
					ref={inputRef}
					type='text'
					value={query}
					onChange={e => handleInputChange(e.target.value)}
					onKeyDown={e => {
						handleKeyDown(e)
						if (e.key === 'Enter') handleSearch()
					}}
					placeholder='Пошук...'
					autoFocus
					className='sidebar-input'
				/>
				<Button
					variant='ghost'
					size='icon'
					className='sidebar-button'
					onClick={handleSearch}
				>
					<Search />
				</Button>

				{isSuggestionsVisible && suggestions.length > 0 && (
					<div
						ref={suggestionsRef}
						className='absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10'
					>
						{suggestions.map((suggestion, index) => (
							<div
								key={index}
								className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
								onClick={() => {
									dispatch(setQuery(suggestion))
									setSuggestions([])
									setIsSuggestionsVisible(false)
								}}
							>
								{suggestion}
							</div>
						))}
						{savedQueries.length > 0 && (
							<div
								className='px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
								onClick={clearSavedQueries}
							>
								<XCircle className='w-5 h-5' />
								<span>Очистити історію пошуку</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
