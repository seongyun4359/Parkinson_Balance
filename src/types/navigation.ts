import { StackNavigationProp } from "@react-navigation/stack"

export type RootStackParamList = {
	SearchInfo: undefined
	EditInfo: { patientInfo: any }
	Prescription: { patientInfo: any }
	InfoTable: undefined
	DetailTable: {
		patientIds: string[]
	}
}

export type SearchScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	"SearchInfo"
>
