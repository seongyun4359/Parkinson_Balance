import { Patient } from "../types/patient"
import { ExercisePrescriptionItem } from "../types/exercisePrescription"

export type RootStackParamList = {
	Login: undefined
	MedicalStaffHome: undefined
	PatientHome: undefined
	Alarm: undefined
	ExerciseScreen: undefined
	Category: undefined
	KidneyExercise: undefined
	StrengthExercise: undefined
	BalanceExercise: undefined
	OralExercise: undefined
	DayRecord: undefined
	RecordScreen: { 
		progress: number; 
		videoProgress: Record<string, number>; 
		exerciseGoals: ExercisePrescriptionItem[];  
	  };
	SignUp: undefined
	EditInfo: { patientInfo: any }
	Prescription: { patientInfo: any }
	SearchInfo: undefined | { updatedPatientInfo: any }
	InfoTable: undefined
	DetailTable: { patientIds: string[] }
	MyInformation: undefined
	MedicalStaffAuth: undefined
	PatientDetail: { patient: Patient }
}
