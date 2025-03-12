export const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	const now = new Date()
	const diffTime = Math.abs(now.getTime() - date.getTime())
	const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

	if (diffHours < 24) {
		if (diffHours === 0) {
			const diffMinutes = Math.floor(diffTime / (1000 * 60))
			return `${diffMinutes}분 전`
		}
		return `${diffHours}시간 전`
	} else if (diffDays < 7) {
		return `${diffDays}일 전`
	} else {
		return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`
	}
}

export const getLoginStatus = (dateString: string): string => {
	const date = new Date(dateString)
	const now = new Date()
	const diffTime = Math.abs(now.getTime() - date.getTime())
	const diffHours = Math.floor(diffTime / (1000 * 60 * 60))

	if (diffHours < 24) {
		return "최근 접속"
	} else if (diffHours < 72) {
		return "3일 이내"
	} else {
		return "장기 미접속"
	}
}
