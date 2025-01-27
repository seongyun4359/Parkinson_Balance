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

const mockPatients: Patient[] = [
	{
		id: 1,
		name: "홍길동",
		gender: "남자",
		phoneNumber: "010-1234-5678",
		prescriptions: [
			{ id: 101, name: "혈압약", dateIssued: "2025-01-01" },
			{ id: 102, name: "당뇨약", dateIssued: "2025-01-15" },
		],
	},
	{
		id: 2,
		name: "김영희",
		gender: "여자",
		phoneNumber: "010-8765-4321",
		prescriptions: [{ id: 103, name: "소화제", dateIssued: "2025-01-10" }],
	},
	{
		id: 3,
		name: "박철수",
		gender: "남자",
		phoneNumber: "010-5555-6666",
		prescriptions: [
			{ id: 104, name: "진통제", dateIssued: "2025-01-20" },
			{ id: 105, name: "비타민 D", dateIssued: "2025-01-22" },
		],
	},
]

export const searchPatientByName = (name: string): Patient | undefined => {
	return mockPatients.find((patient) => patient.name === name)
}

export default mockPatients
