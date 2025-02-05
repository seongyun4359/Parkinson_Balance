//  Gender Enum
export enum Gender {
	MALE = "MALE",
	FEMALE = "FEMALE",
}

//  RoleType Enum
export enum RoleType {
	PATIENT = "PATIENT",
	ADMIN = "ADMIN",
}

//  User (사용자 정보)
export interface User {
	userId: string // Nanold
	id: string
	password: string
	name: string
	gender: Gender
	createdDate: string // LocalDateTime
	modifiedDate: string // LocalDateTime
	role: RoleType
	lastLoginDate: string // LocalDateTime
	exerciseNotificationTime: string // LocalDateTime
}

//  Exercise (운동 정보)
export interface Exercise {
	exerciseId: string // Nanold
	category: Category
	index: number
	korName: string
	engName: string
	repeatCount: number
	setCount: number
	isOptional: boolean
}

//  ExerciseHistories (운동 수행 기록)
export interface ExerciseHistory {
	historyId: string // Nanold
	user: User
	exercise: Exercise
	repeatCount: number
	setCount: number
	doneDate: string // LocalDateTime
	repeatGoal: number
	setGoal: number
}

//  Category (운동 카테고리)
export interface Category {
	categoryId: string // Nanold
	categoryName: string
}

//  Goals (사용자의 운동 목표)
export interface Goal {
	goalId: string // Nanold
	user: User
	exercise: Exercise
	repeatCount: number
	setCount: number
	updateGoals: () => void
}

//  Notifications (알림)
export interface Notification {
	notificationId: string // Nanold
	user: User
	title: string
	content: string
	createdDate: string // LocalDateTime
}
