export const API_CONFIG = {
	PRODUCTION: "https://pddiary.kwidea.com",
	STAGING: "https://kwhcclab.com:20955",
}

// 현재 사용할 환경 설정
//export const CURRENT_ENV = "STAGING"
export const CURRENT_ENV = "PRODUCTION"

export const getApiEndpoint = () => {
	console.log("🔧 API 환경:", CURRENT_ENV)
	console.log("🌍 API 엔드포인트 반환:", API_CONFIG[CURRENT_ENV])
	return API_CONFIG[CURRENT_ENV]
}
