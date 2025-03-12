export interface PatientInfoType {
	memberId: string
	name: string
	phoneNumber: string
	gender: "MALE" | "FEMALE"
	lastLoginAt?: string
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
	id: string
	name: string
	phoneNumber: string
	gender: string
	lastLogin: string
	isFavorite: boolean
	exerciseScore: number
}

export interface SortConfig {
	key: keyof Patient
	order: "asc" | "desc"
}

export type FilterType = "favorite" | "recentLogin"

export interface FilterConfig {
	type: FilterType
	value: boolean
}

export interface SearchFilterBarProps {
	searchValue: string
	onSearchChange: (value: string) => void
	filters: FilterConfig[]
	onFiltersChange: (filters: FilterConfig[]) => void
}
