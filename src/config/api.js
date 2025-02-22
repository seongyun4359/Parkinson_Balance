export const API_CONFIG = {
	PRODUCTION: "https://pddiary.kwidea.com",
	STAGING: "https://kwhcclab.com:20955",
}

// 현재 사용할 환경 설정
export const CURRENT_ENV = "STAGING"

export const getApiEndpoint = () => {
	return API_CONFIG[CURRENT_ENV]
}
