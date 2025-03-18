export const exerciseNameToNumber: Record<string, string> = {
  // 1단계 운동
  "목 앞 근육 스트레칭": "1-1",
  "목 좌우 근육 스트레칭": "1-2",
  "몸통 앞쪽 근육 스트레칭": "1-3",
  "몸통 옆쪽 근육 스트레칭 (밴드)": "1-4",
  "몸통 회전 근육 스트레칭 (밴드)": "1-5",
  "몸통 스트레칭 1단계 (엎드려서)": "1-6",
  "몸통 스트레칭 2단계 (엎드려서)": "1-7",
  "날개뼈 움직이기": "1-8",
  "어깨 들어올리기": "1-9",
  "날개뼈 모으기": "1-10",
  "손목 및 팔꿈치 주변 근육 스트레칭": "1-11",
  "허벅지 및 종아리 근육 스트레칭": "1-12",

  // 2단계 운동
  "엉덩이 들기": "2-1",
  "엎드려 누운 상태에서 다리들기": "2-2",
  "엉덩이 옆 근육 운동": "2-3",
  "무릎 벌리기": "2-4",
  "무릎 펴기": "2-5",
  "런지": "2-6",
  "좌우 런지": "2-7",
  "발전된 런지": "2-8",
  "손목 및 팔꿈치 주변 근육": "2-9",
  "날개 뼈 모음 근육": "2-10",
  "앉았다 일어서기": "2-11",
  "발전된 앉았다 일어서기": "2-12",
  "어깨 운동 1단계": "2-13",
  "어깨 운동 2단계": "2-14",

  // 3단계 운동 (균형/협응)
  "한발 서기": "3-1",
  "버드독 1단계": "3-2",
  "버드독 2단계": "3-3",
  "앉은 상태에서 제자리 걷기": "3-4",
  "움직이는 런지": "3-5",

  // 4단계 운동 (구강/발성)
  "아에이오우": "4-1",
  "파파파파파": "4-2",
  "쪽 소리내기": "4-3",
  "혀로 볼 밀기": "4-4",
  "혀로 입천장 밀기": "4-5",
  "똑딱 소리내기": "4-6",
  "혀 물고 침 삼키기": "4-7",
  "아 짧게 소리내기": "4-8",
  "아 길게 소리내기": "4-9",
  "고음 가성으로 소리내기": "4-10",
  "도레미파솔라시도": "4-11",
  "큰 소리로 음절 읽기": "4-12",
  "큰 소리로 글 읽기": "4-13",
  "애국가 부르기": "4-14",
};

// 🎥 비디오 파일 매핑
export const videoSources: Record<string, NodeRequire> = {
  // 1단계
  "1-1": require("../../../assets/video/1-1.mp4"),
  "1-2": require("../../../assets/video/1-2.mp4"),
  "1-3": require("../../../assets/video/1-3.mp4"),
  "1-4": require("../../../assets/video/1-4.mp4"),
  "1-5": require("../../../assets/video/1-5.mp4"),
  "1-6": require("../../../assets/video/1-6.mp4"),
  "1-7": require("../../../assets/video/1-7.mp4"),
  "1-8": require("../../../assets/video/1-8.mp4"),
  "1-9": require("../../../assets/video/1-9.mp4"),
  "1-10": require("../../../assets/video/1-10.mp4"),
  "1-11": require("../../../assets/video/1-11.mp4"),
  "1-12": require("../../../assets/video/1-12.mp4"),

  // 2단계
  "2-1": require("../../../assets/video/2-1.mp4"),
  "2-2": require("../../../assets/video/2-2.mp4"),
  "2-3": require("../../../assets/video/2-3.mp4"),
  "2-4": require("../../../assets/video/2-4.mp4"),
  "2-5": require("../../../assets/video/2-5.mp4"),
  "2-6": require("../../../assets/video/2-6.mp4"),
  "2-7": require("../../../assets/video/2-7.mp4"),
  "2-8": require("../../../assets/video/2-8.mp4"),
  "2-9": require("../../../assets/video/2-9.mp4"),
  "2-10": require("../../../assets/video/2-10.mp4"),
  "2-11": require("../../../assets/video/2-11.mp4"),
  "2-12": require("../../../assets/video/2-12.mp4"),
  "2-13": require("../../../assets/video/2-13.mp4"),
  "2-14": require("../../../assets/video/2-14.mp4"),

  // 3단계
  "3-1": require("../../../assets/video/3-1.mp4"),
  "3-2": require("../../../assets/video/3-2.mp4"),
  "3-3": require("../../../assets/video/3-3.mp4"),
  "3-4": require("../../../assets/video/3-4.mp4"),
  "3-5": require("../../../assets/video/3-5.mp4"),

  // 4단계 (구강/발성)
  "4-1": require("../../../assets/video/4-1.mp4"),
  "4-2": require("../../../assets/video/4-2.mp4"),
  "4-3": require("../../../assets/video/4-3.mp4"),
  "4-4": require("../../../assets/video/4-4.mp4"),
  "4-5": require("../../../assets/video/4-5.mp4"),
  "4-6": require("../../../assets/video/4-6.mp4"),
  "4-7": require("../../../assets/video/4-7.mp4"),
  "4-8": require("../../../assets/video/4-8.mp4"),
  "4-9": require("../../../assets/video/4-9.mp4"),
  "4-10": require("../../../assets/video/4-10.mp4"),
  "4-11": require("../../../assets/video/4-11.mp4"),
  "4-12": require("../../../assets/video/4-12.mp4"),
  "4-13": require("../../../assets/video/4-13.mp4"),
  "4-14": require("../../../assets/video/4-14.mp4"),
};

// 🎥 운동 영상 가져오기 함수
export const getVideoSource = (exerciseName: string): { uri: NodeRequire } | undefined => {
  const videoNumber = exerciseNameToNumber[exerciseName];
  return videoNumber && videoSources[videoNumber] ? { uri: videoSources[videoNumber] } : undefined;
};
