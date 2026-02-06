import type { NavItem, Service, Testimonial, Stat } from "./types";

export const SITE_CONFIG = {
  name: "에이정",
  nameEn: "AIJeong",
  fullName: "에이정 주식회사",
  description: "가장 쉬운 AI교육, 에이정",
  url: "https://aijeong.com",
  email: "aijeong.insight@gmail.com",
  address: "경기도 남양주시 별내중앙로 30, 2층 204-에이치96호(별내동)",
  ceo: "권순현, 강기현",
  businessNumber: "265-86-03495",
};

export const NAV_ITEMS: NavItem[] = [
  { label: "블로그", href: "/135-2/" },
  { label: "교육사례", href: "/교육사례-2/" },
  { label: "문의하기", href: "/contact/" },
];

export const SERVICES: Service[] = [
  {
    icon: "Brain",
    title: "AI 리터러시 교육",
    description: "ChatGPT, Claude 등 생성형 AI 도구의 이해와 활용법을 체계적으로 학습합니다.",
    features: [
      "생성형 AI 기초 이론",
      "프롬프트 엔지니어링",
      "실무 활용 워크숍",
      "AI 윤리와 저작권",
    ],
  },
  {
    icon: "Video",
    title: "AI 숏폼 콘텐츠 제작",
    description: "AI 도구를 활용한 숏폼 영상 기획, 제작, 편집의 전 과정을 배웁니다.",
    features: [
      "콘텐츠 기획 전략",
      "AI 영상 제작 도구",
      "편집 및 후반 작업",
      "플랫폼별 최적화",
    ],
  },
  {
    icon: "Zap",
    title: "업무 효율화 교육",
    description: "AI를 활용한 문서 작성, 데이터 분석, 자동화 등 실무 생산성을 극대화합니다.",
    features: [
      "문서 자동화",
      "데이터 분석 자동화",
      "워크플로우 최적화",
      "맞춤형 AI 솔루션",
    ],
  },
];

export const STATS: Stat[] = [
  { label: "누적 교육 횟수", value: 200, suffix: "회+" },
  { label: "누적 수강생", value: 5000, suffix: "명+" },
  { label: "교육 만족도", value: 98, suffix: "%" },
  { label: "재계약률", value: 95, suffix: "%" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "김민수",
    role: "인사팀장",
    organization: "대기업 A사",
    content: "에이정의 AI 교육 덕분에 팀 전체의 업무 효율이 크게 향상되었습니다. 실무 중심의 커리큘럼이 특히 좋았습니다.",
    rating: 5,
  },
  {
    name: "이서연",
    role: "교육 담당자",
    organization: "공공기관 B",
    content: "수강생들의 만족도가 매우 높았습니다. 특히 실습 위주의 교육이 현업에 바로 적용 가능해서 좋았습니다.",
    rating: 5,
  },
  {
    name: "박지훈",
    role: "대표이사",
    organization: "스타트업 C",
    content: "AI 도구 활용법을 체계적으로 배울 수 있었습니다. 소규모 팀에서도 큰 효과를 볼 수 있었습니다.",
    rating: 5,
  },
];

export const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/@aijeong",
  instagram: "https://www.instagram.com/ai__jeong?igsh=M21vanRma2tyMjJ3&utm_source=qr",
  blog: "https://blog.naver.com/ai__jeong",
};
