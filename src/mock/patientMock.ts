import { Patient } from "../types/patient"

export const patientMockData: Patient[] = Array.from(
	{ length: 100 },
	(_, index) => ({
		id: `P${String(index + 1).padStart(3, "0")}`,
		name: `환자${index + 1}`,
		lastVisit: new Date(
			2024 - Math.floor(Math.random() * 2),
			Math.floor(Math.random() * 12),
			Math.floor(Math.random() * 28)
		)
			.toISOString()
			.split("T")[0],
		activityLevel: Math.floor(Math.random() * 5) + 1,
		isFavorite: Math.random() > 0.8,
		birthDate: new Date(
			1960 + Math.floor(Math.random() * 40),
			Math.floor(Math.random() * 12),
			Math.floor(Math.random() * 28)
		)
			.toISOString()
			.split("T")[0],
		gender: Math.random() > 0.5 ? "male" : "female",
		phoneNumber: `010-${String(Math.floor(Math.random() * 9999)).padStart(
			4,
			"0"
		)}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
		address: `서울시 강남구 테헤란로 ${Math.floor(Math.random() * 999) + 1}길`,
	})
)
