export interface ExerciseScore {
	daily: number
	weekly: number
	monthly: number
}

export interface ExerciseHistory {
	date: string
	score: number
}

export type ExerciseGoalItem = {
	goalId: number
	exerciseName: string
	category: string
	setCount: number
	duration: number
}
