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
