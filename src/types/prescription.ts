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
	type: string
	details: string[]
}

export interface Prescription {
	date: string
	hospitalName: string
	doctorName: string
	diagnosis: string
	medications: { name: string; dosage: string; instructions: string }[]
	exercisePrescriptions?: ExercisePrescription[] // ✅ 여기서 사용
	nextAppointment?: string
}
