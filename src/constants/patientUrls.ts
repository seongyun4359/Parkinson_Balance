export const API_URL = "https://pddiary.kwidea.com/api"

export const API_URLS = {
	refreshToken: `${API_URL}/refresh`,
	getExerciseHistories: (date?: string) =>
		date
			? `${API_URL}/exercises/histories/${date}?page=0&size=50`
			: `${API_URL}/exercises/histories?page=0&size=50`,
	startExercise: (goalId: number) => `${API_URL}/exercises/${goalId}`,
	completeSet: (historyId: number) => `${API_URL}/exercises/${historyId}/complete-set`,
	completeAerobic: (historyId: number) => `${API_URL}/exercises/${historyId}/complete-aerobic`,
	goalsByDate: (date: string, page = 0, size = 50) =>
		`${API_URL}/exercises/goals/${date}?page=${page}&size=${size}`,
}
