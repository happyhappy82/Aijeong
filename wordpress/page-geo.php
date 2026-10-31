<?php
/** GEO service detail, matched automatically to /geo/. */
get_header();
?>
<div class="geo-home aj-service">
    <section class="aj-service-hero" aria-labelledby="service-heading">
        <div class="geo-wrap geo-wrap-narrow">
            <nav class="aj-service-breadcrumb" aria-label="현재 위치"><a href="<?php echo esc_url(home_url('/')); ?>">홈</a><span aria-hidden="true">/</span><a href="<?php echo esc_url(home_url('/#services')); ?>">서비스</a><span aria-hidden="true">/</span><span aria-current="page">브랜드 AI검색 노출</span></nav>
            <span class="geo-section-badge">브랜드 AI검색 노출</span>
            <h1 id="service-heading">AI 검색에 소개될<br>브랜드의 정보를 정리합니다</h1>
            <p class="aj-service-lead">고객이 묻는 질문을 바탕으로 브랜드 정보와 콘텐츠를 점검합니다 <br>SEO 기반을 확인하고 AI 답변에서 참고할 내용을 보완합니다</p>
            <div class="aj-service-actions"><a class="geo-button geo-button-primary" href="<?php echo esc_url(aijeong_service_inquiry_url('geo')); ?>">문의하기</a><a class="geo-button geo-button-outline" href="#seo-foundation">SEO와 GEO의 관계 보기</a></div>
            <p class="aj-service-caption">GEO·AEO · 검색 현황 진단 · SEO 점검 · 브랜드 정보 정리 · 콘텐츠 개선</p>
        </div>
    </section>

    <section class="geo-section geo-section-alt" aria-labelledby="geo-start-heading">
        <div class="geo-wrap geo-wrap-narrow aj-service-split">
            <div class="aj-service-heading"><span class="geo-section-badge">시작하는 지점</span><h2 id="geo-start-heading">우리 브랜드의 설명은<br>충분히 갖춰져 있나요?</h2><p>브랜드가 원하는 소개와 고객이 찾는 정보 사이의 빈틈을 살펴봅니다</p></div>
            <div class="aj-service-rows">
                <article><span>01</span><div><h3>서비스는 있는데 설명이 부족할 때</h3><p>대상 고객, 이용 조건, 진행 방식처럼 선택에 필요한 정보가 공식 사이트에 있는지 확인합니다</p></div></article>
                <article><span>02</span><div><h3>채널마다 브랜드 정보가 다를 때</h3><p>홈페이지와 외부 채널의 브랜드명, 서비스 내용, 연락처를 비교하고 실제 정보에 맞게 정리합니다</p></div></article>
                <article><span>03</span><div><h3>AI 답변에 어떤 모습으로 나오는지 모를 때</h3><p>고객이 물어볼 질문으로 현재 답변을 확인하고 소개 내용과 참고 출처를 살펴봅니다</p></div></article>
            </div>
        </div>
    </section>

    <section class="geo-section" id="seo-foundation" aria-labelledby="seo-foundation-heading">
        <div class="geo-wrap geo-wrap-narrow">
            <div class="aj-service-heading"><span class="geo-section-badge">SEO부터 살펴보는 이유</span><h2 id="seo-foundation-heading">GEO·AEO의 기본은<br>SEO입니다</h2><p>AI 검색에 소개될 내용을 만들기 전에 <br>검색엔진이 사이트를 찾고 읽을 수 있는지 먼저 확인합니다</p></div>
            <div class="aj-search-foundation" aria-label="SEO 기반 위에서 함께 준비하는 AEO와 GEO">
                <div class="aj-search-upper"><article><span>AEO</span><h3>질문에 답하는 내용</h3><p>고객이 궁금해하는 내용을 찾아 <br>조건과 근거가 있는 답변으로 정리</p></article><article><span>GEO</span><h3>브랜드를 설명할 정보</h3><p>브랜드와 서비스의 특징을 분명하게 쓰고 <br>참고할 공식 자료와 연결</p></article></div>
                <article class="aj-search-base"><span>SEO</span><div><h3>검색엔진이 찾고 읽을 수 있는 웹사이트</h3><p>크롤링·색인 가능 여부, 페이지 제목과 주소, 내부 링크, 텍스트 콘텐츠부터 점검</p></div></article>
            </div>
            <div class="aj-service-evidence"><p>Google은 AI Overviews와 AI Mode에도 기존 SEO 기본 원칙이 적용된다고 안내합니다 해당 기능에서 참고 링크로 표시되려면 페이지가 색인되어 있고 검색 결과에 스니펫을 표시할 수 있어야 합니다</p><p>에이정은 이 검색 기반을 점검하면서 고객의 질문에 답하는 콘텐츠와 정확한 브랜드 정보를 함께 정비합니다</p><a class="geo-link" href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">Google 공식 안내 확인 <span aria-hidden="true">↗</span></a></div>
        </div>
    </section>

    <section class="geo-section geo-section-alt" aria-labelledby="geo-scope-heading">
        <div class="geo-wrap geo-wrap-narrow aj-service-split">
            <div class="aj-service-heading"><span class="geo-section-badge">진행하는 작업</span><h2 id="geo-scope-heading">질문과 사이트를 보고<br>고칠 순서를 정합니다</h2><p>현재 상태에 따라 필요한 항목을 정하고 <br>작업 범위를 협의합니다</p></div>
            <div class="aj-service-rows">
                <article><span>01</span><div><h3>고객 질문과 검색 현황 확인</h3><p>어떤 고객이 어떤 상황에서 브랜드를 찾는지 정리합니다 질문별 검색 결과와 AI 답변을 확인해 개선할 지점을 찾습니다</p></div></article>
                <article><span>02</span><div><h3>SEO 기반 점검</h3><p>검색 수집과 색인을 막는 설정, 페이지 제목, 중복 주소, 내부 링크를 확인합니다 중요한 설명이 이미지에만 들어가 있지는 않은지도 살펴봅니다</p></div></article>
                <article><span>03</span><div><h3>브랜드 정보와 콘텐츠 개선</h3><p>브랜드 소개와 서비스 페이지를 보완합니다 고객이 비교할 조건과 실제 제공 범위, 확인할 수 있는 근거를 담습니다</p></div></article>
                <article><span>04</span><div><h3>변경 내용과 검색 변화 점검</h3><p>수정한 페이지와 작업 이력을 남깁니다 검색 유입과 문의, AI 답변의 소개 내용을 구분해 살펴보고 다음 작업을 정합니다</p></div></article>
            </div>
        </div>
    </section>

    <section class="geo-section" aria-labelledby="geo-deliverables-heading">
        <div class="geo-wrap geo-wrap-narrow"><div class="aj-service-heading"><span class="geo-section-badge">함께 확인할 내용</span><h2 id="geo-deliverables-heading">무엇을 왜 바꾸는지<br>알 수 있도록</h2></div>
            <dl class="aj-service-deliverables"><div><dt>현황과 우선순위</dt><dd>고객 질문, 검색 현황, 사이트 점검 결과를 보고 먼저 고칠 항목을 정리합니다</dd></div><div><dt>페이지별 개선 내용</dt><dd>브랜드 소개와 서비스 설명, 필요한 콘텐츠를 페이지 단위로 정리합니다</dd></div><div><dt>작업 기록과 다음 계획</dt><dd>무엇을 바꿨는지 남기고 이후에 확인할 질문과 페이지를 정합니다</dd></div></dl>
            <p class="aj-service-note">AI 답변을 비교할 때는 질문과 언어, 사용한 서비스와 확인 시점을 함께 기록합니다</p>
        </div>
    </section>

    <section class="geo-section geo-section-alt" aria-labelledby="geo-faq-heading">
        <div class="geo-wrap geo-wrap-narrow aj-service-split"><div class="aj-service-heading"><span class="geo-section-badge">자주 묻는 질문</span><h2 id="geo-faq-heading">시작 전에<br>궁금하실 내용</h2></div>
            <div class="aj-service-faq"><details><summary>SEO를 잘하면 AI에도 자동으로 노출되나요?</summary><p>SEO는 검색 가능한 사이트를 만드는 기본 작업입니다 다만 검색 순위가 높다고 AI 답변에 반드시 소개되는 것은 아닙니다 질문에 맞는 내용과 근거, 정보의 정확성을 함께 살피고 실제 답변도 별도로 확인합니다</p></details><details><summary>기존 홈페이지로 시작해도 되나요?</summary><p>가능합니다 지금 사이트의 구조와 콘텐츠를 먼저 점검합니다 기존 페이지를 보완할지, 별도 페이지가 필요할지, 리뉴얼까지 할지는 확인 후 정합니다</p></details><details><summary>GEO와 AEO는 따로 신청해야 하나요?</summary><p>브랜드 AI검색 노출 서비스 안에서 함께 검토합니다 SEO 기반, 질문에 답하는 콘텐츠, 브랜드 정보 중 현재 필요한 작업을 정해 진행합니다</p></details><details><summary>어떤 자료를 준비하면 되나요?</summary><p>브랜드명과 홈페이지 주소, 주력 서비스, 고객에게 자주 받는 질문을 알려주세요 기존 소개서와 공식 자료가 있으면 함께 살펴봅니다</p></details></div>
        </div>
    </section>
    <?php get_template_part('template-parts/service-contact'); ?>
</div>
<?php get_footer(); ?>
