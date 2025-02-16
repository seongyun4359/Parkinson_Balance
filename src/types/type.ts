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
	userId: string
	id: string
	password: string
	name: string
	gender: Gender
	createdDate: string
	modifiedDate: string
	role: RoleType
	lastLoginDate: string
	exerciseNotificationTime: string
}

//  Exercise (운동 정보)
export interface Exercise {
	exerciseId: string
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
	historyId: string
	user: User
	exercise: Exercise
	repeatCount: number
	setCount: number
	doneDate: string
	repeatGoal: number
	setGoal: number
}

//  Category (운동 카테고리)
export interface Category {
	categoryId: string
	categoryName: string
}

//  Goals (사용자의 운동 목표)
export interface Goal {
	goalId: string
	user: User
	exercise: Exercise
	repeatCount: number
	setCount: number
	updateGoals: () => void
}

//  Notifications (알림)
export interface Notification {
	notificationId: string
	user: User
	title: string
	content: string
	createdDate: string
}
