export interface PatientInfoType {
	name: string
	gender: string
	phoneNumber: string
	prescriptionImage?: string
	password: string
}

export interface PatientInfoProps {
	patientInfo: PatientInfoType
	onPrescriptionPress?: () => void
}

export interface PatientTableData {
	id: string
	name: string
	lastLogin: string
	movementScore: number
	selected?: boolean
}

export interface PatientTableProps {
	data: PatientTableData[]
	onSelect: (id: string) => void
	onSelectAll: () => void
	selectedIds: string[]
}

export interface Patient {
	exerciseScore: number
	id: string
	name: string
	lastVisit: string
	activityLevel: number
	isFavorite: boolean
	birthDate: string
	gender: "male" | "female"
	phoneNumber: string
	lastLogin: string
}

export interface SortConfig {
	key: keyof Patient
	direction: "asc" | "desc"
}

export interface FilterConfig {
	key: keyof Patient
	value: string | number
}
