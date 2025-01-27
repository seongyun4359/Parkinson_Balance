export interface PatientInfoType {
	name: string
	gender: string
	phoneNumber: string
	prescriptionImage?: string
}

export interface PatientInfoProps {
	patientInfo: PatientInfoType
	onPrescriptionPress?: () => void
}
