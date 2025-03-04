import { Key, ReactNode } from "react"

export interface Prescription {
	id: string
	date: string
	doctorName: string
	hospitalName: string
	diagnosis: string
	medications: {
		name: string
		dosage: string
		instructions: string
	}[]
	nextAppointment?: string
}

export interface PrescriptionListResponse {
	prescriptions: Prescription[]
	totalPages: number
	currentPage: number
}

export interface ExercisePrescription {
	goalId: Key | null | undefined
	duration: any
	exerciseName: ReactNode
	setCount: ReactNode
	repeatCount: ReactNode
	type: string
	details: string[]
}

export interface Prescription {
	date: string
	hospitalName: string
	doctorName: string
	diagnosis: string
	medications: { name: string; dosage: string; instructions: string }[]
	exercisePrescriptions?: ExercisePrescription[]
	nextAppointment?: string
}
