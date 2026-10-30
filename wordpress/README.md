# 에이정 GEO 홈페이지 — WordPress 테마 패키지

사용자 지정 메인 카피: **GEO, 브랜드가 AI에 보이도록**

기존 `aijeong-theme` 클래식 테마를 기준으로 GEO 홈페이지를 반영합니다. 웹사이트 리뉴얼은 서비스 중 하나로 배치합니다. 정적 시안의 화면을 PHP 템플릿으로 옮기고 기존 블로그·칼럼·교육사례 페이지를 유지합니다.

```sh
python3 wordpress/build-theme.py \
  --base-theme '/Users/mcbookpro/Documents/Claude Code/archive/AJeong Site/aijeong-theme'
```

생성 결과:

- `_local/package/aijeong-theme/`: 업로드 패키지의 실제 테마 소스
- `_local/package/aijeong-theme-v1.7.0-geo-20261030.zip`: WordPress 테마 업로드용 ZIP
- `_local/package/build-report.json`: 변경 파일과 PHP 검사 결과

ZIP의 최상위 폴더는 기존과 같은 `aijeong-theme`입니다. 관리자에서 외모 → 테마 → 새 테마 추가 → 테마 업로드로 올리고 기존 테마 교체를 선택하는 방식입니다. 운영 업로드는 별도 사용자 지시에 따라 수행합니다.

새 메인 CSS·JS는 첫 화면에서만 적용합니다. 기존 헤더의 분석 코드와 `wp_head`, 푸터의 채널톡과 `wp_footer`를 유지하며, 기존 블로그·칼럼·교육사례·문의 페이지 PHP는 수정하지 않습니다. 문의 폼은 시안과 동일한 이메일 초안 방식입니다.

기존 테마에 포함된 운영 설정을 Git에 새로 저장하지 않도록 완성 패키지와 로컬 WordPress DB는 `_local/`에 두고 Git에서 제외합니다. 빌드 스크립트와 새 오버레이만 기록합니다. 기본 테마는 수정하지 않습니다.

## 로컬 WordPress 확인

기존 로컬 WordPress의 코드와 SQLite DB를 별도 `_local/wp/`에 복사해 실행합니다. 원본 DB는 수정하지 않습니다. 이 로컬 복사본에서는 분석·채널톡·운영 웹훅 로드를 끄고 WordPress 외부 HTTP와 크론을 실행하지 않습니다. 이 설정은 업로드 ZIP에 포함하지 않습니다.

```sh
php -S 127.0.0.1:18266 -t _local/wp _local/wp/router.php
```

접속: http://127.0.0.1:18266/

2026-10-30 확인 결과:

- 실제 WordPress가 테마 1.7.0을 정상 인식하고 테마 구조 오류가 없음을 확인했습니다.
- 패키지의 PHP 39개 문법 검사와 ZIP 구조·압축 무결성 검사를 통과했습니다.
- 메인 화면의 GEO 카피·검색 설명·새 CSS/JS·폰트·로고 HTTP 200을 확인했습니다.
- `/ai-education/`, `/column/`, `/contact/`는 200이며 기존 스타일을 사용합니다.
- 블로그·칼럼·교육사례·AI 교육·문의·단일 글·본문 정리 PHP 7개는 원본과 바이트 단위로 동일합니다.
- 로컬 SQLite DB에는 블로그 목록 `/135-2/` 페이지가 없어 해당 경로는 404입니다. 이 페이지의 PHP는 원본 그대로이며 운영 DB를 변경하지 않았습니다.
- 이 변경 후 브라우저 제어 도구의 native pipe 연결 실패로 화면 자동 검수는 완료하지 못했습니다. 직전 버전의 PC·390px 확인과 이번 실제 WordPress 렌더/HTTP 검사를 구분합니다.
- 실제 운영 업로드·문의 전송은 하지 않았습니다.
