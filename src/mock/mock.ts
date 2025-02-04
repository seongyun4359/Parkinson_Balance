// 목 데이터: 환자 정보 및 처방 정보
export interface Prescription {
	id: number
	name: string
	dateIssued: string
}

export interface Patient {
	id: number
	name: string
	gender: "남자" | "여자"
	phoneNumber: string
	prescriptions: Prescription[]
}
// mock.ts
export type PatientInfoType = {
	id: string
	name: string
	gender: string
	phoneNumber: string
	prescription: string
}

const mockPatients: PatientInfoType[] = [
	{
		id: "1",
		name: "홍길동",
		gender: "남자",
		phoneNumber: "010-1234-5678",
		prescription: "감기약, 비타민D",
	},
	{
		id: "2",
		name: "김철수",
		gender: "남자",
		phoneNumber: "010-9876-5432",
		prescription: "혈압약",
	},
	{
		id: "3",
		name: "이영희",
		gender: "여자",
		phoneNumber: "010-4567-8910",
		prescription: "소염제",
	},
]

// 이름으로 환자 검색
export const searchPatientByName = (name: string): PatientInfoType | null => {
	return (
		mockPatients.find(
			(patient) => patient.name.toLowerCase() === name.toLowerCase()
		) || null
	)
}

export default mockPatients
