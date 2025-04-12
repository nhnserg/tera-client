export const StatusMessage = ({
	status,
	message,
}: {
	status: string
	message: string | undefined
}) => {
	const color = status === 'error' ? 'red' : 'gray'
	return <p className={`text-${color}-500`}>{message}</p>
}
