import { StackNavigationProp } from "@react-navigation/stack"
import { Patient } from "./patient"

export type RootStackParamList = {
	MedicalStaffAuth: undefined
	SearchInfo: undefined | { updatedPatientInfo: any }
	EditInfo: { patientInfo: any }
	Prescription: { patientInfo: any }
	InfoTable: undefined
	DetailTable: {
		patientIds: string[]
	}
	PatientDetail: { patient: Patient }
}

export type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, "SearchInfo">
