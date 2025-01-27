import { Prescription, PrescriptionListResponse } from "../types/prescription"

const mockPrescriptions: Prescription[] = [
	{
		id: "1",
		date: "2025/01/18",
		doctorName: "김의사",
		hospitalName: "서울중앙병원",
		diagnosis: "감기",
		medications: [
			{
				name: "타이레놀",
				dosage: "500mg",
				instructions: "1일 3회, 식후 30분",
			},
			{
				name: "종합감기약",
				dosage: "1정",
				instructions: "1일 3회, 식후 30분",
			},
		],
		nextAppointment: "2025/01/25",
	},
	{
		id: "2",
		date: "2025/01/16",
		doctorName: "이의사",
		hospitalName: "연세병원",
		diagnosis: "위염",
		medications: [
			{
				name: "위장약",
				dosage: "1정",
				instructions: "1일 2회, 식전 30분",
			},
		],
		nextAppointment: "2025/01/30",
	},
	{
		id: "3",
		date: "2025/01/14",
		doctorName: "박의사",
		hospitalName: "강남세브란스",
		diagnosis: "두통",
		medications: [
			{
				name: "아스피린",
				dosage: "300mg",
				instructions: "1일 2회, 식후",
			},
			{
				name: "근이완제",
				dosage: "1정",
				instructions: "취침 전 1회",
			},
		],
	},
	{
		id: "4",
		date: "2025/01/12",
		doctorName: "최의사",
		hospitalName: "서울대병원",
		diagnosis: "알레르기",
		medications: [
			{
				name: "항히스타민제",
				dosage: "1정",
				instructions: "1일 1회, 취침 전",
			},
		],
		nextAppointment: "2025/02/12",
	},
	{
		id: "5",
		date: "2024/12/18",
		doctorName: "정의사",
		hospitalName: "고려대병원",
		diagnosis: "요통",
		medications: [
			{
				name: "진통제",
				dosage: "500mg",
				instructions: "1일 3회, 식후",
			},
			{
				name: "근육이완제",
				dosage: "1정",
				instructions: "1일 2회, 아침/저녁",
			},
		],
	},
	{
		id: "6",
		date: "2024/10/02",
		doctorName: "한의사",
		hospitalName: "서울성모병원",
		diagnosis: "고혈압",
		medications: [
			{
				name: "혈압약",
				dosage: "1정",
				instructions: "1일 1회, 아침 식후",
			},
		],
		nextAppointment: "2024/11/02",
	},
	{
		id: "7",
		date: "2024/09/15",
		doctorName: "송의사",
		hospitalName: "강북삼성병원",
		diagnosis: "관절염",
		medications: [
			{
				name: "관절염약",
				dosage: "200mg",
				instructions: "1일 2회, 식후",
			},
			{
				name: "파스",
				dosage: "1매",
				instructions: "통증 부위에 부착",
			},
		],
		nextAppointment: "2024/10/15",
	},
	{
		id: "8",
		date: "2024/08/28",
		doctorName: "윤의사",
		hospitalName: "이대목동병원",
		diagnosis: "비염",
		medications: [
			{
				name: "항히스타민제",
				dosage: "10mg",
				instructions: "1일 1회, 취침 전",
			},
			{
				name: "비강스프레이",
				dosage: "1회",
				instructions: "아침/저녁 각 1회",
			},
		],
	},
	{
		id: "9",
		date: "2024/08/10",
		doctorName: "장의사",
		hospitalName: "중앙대병원",
		diagnosis: "장염",
		medications: [
			{
				name: "정장제",
				dosage: "1포",
				instructions: "1일 3회, 식후",
			},
			{
				name: "지사제",
				dosage: "1정",
				instructions: "설사 시 복용",
			},
		],
		nextAppointment: "2024/08/17",
	},
	{
		id: "10",
		date: "2024/07/25",
		doctorName: "강의사",
		hospitalName: "한양대병원",
		diagnosis: "피부염",
		medications: [
			{
				name: "스테로이드연고",
				dosage: "적정량",
				instructions: "1일 2회 도포",
			},
		],
	},
	{
		id: "11",
		date: "2024/07/12",
		doctorName: "임의사",
		hospitalName: "건국대병원",
		diagnosis: "편두통",
		medications: [
			{
				name: "편두통약",
				dosage: "50mg",
				instructions: "통증 시 복용",
			},
			{
				name: "멀미약",
				dosage: "1정",
				instructions: "필요시 복용",
			},
		],
		nextAppointment: "2024/08/12",
	},
	{
		id: "12",
		date: "2024/06/30",
		doctorName: "신의사",
		hospitalName: "경희대병원",
		diagnosis: "목감기",
		medications: [
			{
				name: "항생제",
				dosage: "250mg",
				instructions: "1일 2회, 식후",
			},
			{
				name: "목캔디",
				dosage: "1개",
				instructions: "통증 시 복용",
			},
		],
	},
	{
		id: "13",
		date: "2024/06/15",
		doctorName: "조의사",
		hospitalName: "인제대병원",
		diagnosis: "근막통증",
		medications: [
			{
				name: "근이완제",
				dosage: "5mg",
				instructions: "1일 2회, 식후",
			},
		],
		nextAppointment: "2024/06/29",
	},
	{
		id: "14",
		date: "2024/05/28",
		doctorName: "백의사",
		hospitalName: "순천향대병원",
		diagnosis: "결막염",
		medications: [
			{
				name: "안약",
				dosage: "1방울",
				instructions: "1일 4회",
			},
			{
				name: "항생제",
				dosage: "100mg",
				instructions: "1일 3회, 식후",
			},
		],
	},
	{
		id: "15",
		date: "2024/05/10",
		doctorName: "남의사",
		hospitalName: "을지대병원",
		diagnosis: "소화불량",
		medications: [
			{
				name: "소화제",
				dosage: "1정",
				instructions: "식후 30분",
			},
		],
		nextAppointment: "2024/06/10",
	},
	{
		id: "16",
		date: "2024/04/22",
		doctorName: "오의사",
		hospitalName: "가톨릭대병원",
		diagnosis: "불면증",
		medications: [
			{
				name: "수면제",
				dosage: "25mg",
				instructions: "취침 30분 전",
			},
			{
				name: "항불안제",
				dosage: "0.5mg",
				instructions: "필요시 복용",
			},
		],
		nextAppointment: "2024/05/20",
	},
]

export const getPrescriptions = (
	page: number,
	limit: number = 10,
	sortOrder: "desc" | "asc" = "desc"
): PrescriptionListResponse => {
	const sorted = [...mockPrescriptions].sort((a, b) => {
		const dateA = new Date(a.date.replace(/\//g, "-"))
		const dateB = new Date(b.date.replace(/\//g, "-"))

		if (sortOrder === "desc") {
			return dateB.getTime() - dateA.getTime()
		}
		return dateA.getTime() - dateB.getTime()
	})

	const start = (page - 1) * limit
	const paginatedItems = sorted.slice(start, start + limit)

	return {
		prescriptions: paginatedItems,
		totalPages: Math.ceil(mockPrescriptions.length / limit),
		currentPage: page,
	}
}
