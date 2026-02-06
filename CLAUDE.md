# CLAUDE.md — 에이정 Astro 사이트 작업 규칙

## 절대 원칙: SEO 무손실 마이그레이션

Google이 이 사이트를 기존 WordPress(aijeong.com)와 **다른 사이트로 인식하게 만드는 어떠한 변경도 금지**한다.

### 변경 금지 항목
- URL 구조 (slug, trailing slash 포함)
- `<title>`, `<meta name="description">`, `<link rel="canonical">` 값/패턴
- Open Graph 태그 값 (og:title, og:description, og:url, og:image)
- robots.txt 크롤링 허용 범위
- sitemap.xml에 포함된 URL 목록
- GA/GTM 추적 ID (`GTM-MZVN98MT`, `G-8VQ0NDW54N`)
- 페이지 본문 콘텐츠 (WordPress에서 가져온 HTML 원문)
- 내부 링크 구조 (글 간 링크, 카테고리 링크)
- hreflang, lang="ko" 설정
- 301 리다이렉트 맵 (vercel.json의 redirects)

### 허용되는 변경
- 성능 최적화 (이미지 압축/포맷, lazy loading, preconnect, 스크립트 지연 로딩)
- 구조화 데이터 **추가** (기존 것 수정 아닌 새로 추가만)
- 접근성 개선 (색상 대비, 터치 타겟, ARIA)
- RSS 피드 추가 (신규 기능 추가는 OK)
- CSS/디자인 변경 (시각적 변경은 SEO에 영향 없음)
- 에러 처리 개선 (onerror, fallback UI)
- Twitter Card 태그 보완 (기존 OG 값 변경 없이 추가)
- sitemap에 lastmod 추가 (기존 URL 변경 없이 메타데이터 보강)

### 판단 기준
> "이 변경이 Googlebot의 크롤링/인덱싱 결과를 바꾸는가?"
> → YES이면 하지 않는다. NO이면 진행한다.
