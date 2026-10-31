<?php
/** AI education service detail, using the existing /ai-education/ address. */
get_header();
?>
<div class="geo-home aj-service">
    <section class="aj-service-hero" aria-labelledby="service-heading">
        <div class="geo-wrap geo-wrap-narrow">
            <nav class="aj-service-breadcrumb" aria-label="현재 위치"><a href="<?php echo esc_url(home_url('/')); ?>">홈</a><span aria-hidden="true">/</span><a href="<?php echo esc_url(home_url('/#services')); ?>">서비스</a><span aria-hidden="true">/</span><span aria-current="page">AI교육</span></nav>
            <span class="geo-section-badge">AI교육</span>
            <h1 id="service-heading">배운 내용을<br>업무에 써보는 AI교육</h1>
            <p class="aj-service-lead">기업과 기관의 실제 업무를 교육 안으로 가져옵니다 <br>참여자의 직무와 수준에 맞춰 직접 만들고 검토하는 실습을 구성합니다</p>
            <div class="aj-service-actions"><a class="geo-button geo-button-primary" href="<?php echo esc_url(aijeong_service_inquiry_url('ai-education')); ?>">문의하기</a><a class="geo-button geo-button-outline" href="<?php echo esc_url(home_url('/교육사례-2/')); ?>">교육사례 보기</a></div>
            <p class="aj-service-caption">기업 · 공공기관 · 학교 · 협회 / 강의 · 워크숍 · 직무별 실습</p>
        </div>
    </section>

    <section class="geo-section geo-section-alt" aria-labelledby="education-purpose-heading">
        <div class="geo-wrap geo-wrap-narrow aj-service-split"><div class="aj-service-heading"><span class="geo-section-badge">교육의 출발점</span><h2 id="education-purpose-heading">우리 조직의 업무부터<br>살펴봅니다</h2><p>참여자가 어떤 일을 하는지 알면 <br>실습 내용도 달라집니다</p></div><div class="aj-service-rows"><article><span>01</span><div><h3>AI를 처음 접하는 구성원</h3><p>AI가 답하는 방식과 질문하는 방법을 익힙니다 결과를 그대로 쓰기 전에 확인해야 할 내용도 함께 다룹니다</p></div></article><article><span>02</span><div><h3>실제 업무에 적용하고 싶은 실무자</h3><p>보고서, 회의록, 자료조사처럼 자주 하는 업무로 실습합니다 초안을 만들고 수정하는 과정을 직접 경험합니다</p></div></article><article><span>03</span><div><h3>팀의 활용 기준을 맞추고 싶은 조직</h3><p>업무별 활용 방법과 결과 검토 기준을 정리합니다 입력 가능한 자료의 범위와 정보 취급 원칙도 함께 확인합니다</p></div></article></div></div>
    </section>

    <section class="geo-section" aria-labelledby="education-topics-heading">
        <div class="geo-wrap geo-wrap-narrow"><div class="aj-service-heading"><span class="geo-section-badge">교육 주제</span><h2 id="education-topics-heading">이런 업무로<br>직접 연습합니다</h2><p>아래는 교육 주제의 예시입니다 <br>직무와 수준, 교육 시간에 맞춰 내용을 조정합니다</p></div>
            <div class="aj-education-topics"><article><span>기초</span><h3>AI 이해와 질문 작성</h3><p>질문에 목적과 조건을 담는 방법을 익히고 답변을 비교합니다 사실 확인과 정보 입력 시 주의할 점도 다룹니다</p><p class="aj-topic-output">실습 예시 <strong>같은 업무의 질문을 고쳐 결과 비교하기</strong></p></article><article><span>문서</span><h3>보고서와 업무 문서</h3><p>초안 작성, 요약, 문장 수정 과정을 연습합니다 조직에서 쓰는 문서 형식에 맞춰 내용을 다듬습니다</p><p class="aj-topic-output">실습 예시 <strong>회의 메모를 회의록과 후속 업무로 정리하기</strong></p></article><article><span>조사</span><h3>자료조사와 정보 검토</h3><p>찾을 정보의 범위를 정하고 자료를 비교합니다 출처와 확인 날짜를 살펴보며 근거를 정리합니다</p><p class="aj-topic-output">실습 예시 <strong>공식 자료를 비교해 조사 메모 만들기</strong></p></article><article><span>적용</span><h3>반복 업무 개선</h3><p>반복하는 업무의 순서를 나눠보고 AI를 쓸 부분을 찾습니다 다시 활용할 프롬프트와 검토 항목을 정리합니다</p><p class="aj-topic-output">실습 예시 <strong>우리 팀 업무 하나의 활용 절차 정리하기</strong></p></article></div>
        </div>
    </section>

    <section class="geo-section geo-section-alt" aria-labelledby="education-process-heading">
        <div class="geo-wrap geo-wrap-narrow"><div class="aj-service-heading"><span class="geo-section-badge">진행 방식</span><h2 id="education-process-heading">업무를 고르고<br>직접 만들어봅니다</h2></div><ol class="aj-service-steps"><li><span>01</span><h3>교육 수요 확인</h3><p>참여자 직무와 숙련도 <br>기대하는 결과를 확인</p></li><li><span>02</span><h3>실습 내용 설계</h3><p>시간과 사용 환경에 맞춰 <br>업무 예시와 자료를 준비</p></li><li><span>03</span><h3>실습과 피드백</h3><p>직접 작성한 결과를 비교하고 <br>빠진 내용과 오류를 검토</p></li><li><span>04</span><h3>업무 적용 정리</h3><p>다시 사용할 질문과 양식 <br>결과 검토 기준을 정리</p></li></ol></div>
    </section>

    <section class="geo-section" aria-labelledby="education-preparation-heading">
        <div class="geo-wrap geo-wrap-narrow aj-service-split"><div class="aj-service-heading"><span class="geo-section-badge">사전 준비</span><h2 id="education-preparation-heading">교육을 제안할 때<br>이런 내용을 확인합니다</h2></div><dl class="aj-service-deliverables"><div><dt>참여 대상과 인원</dt><dd>어떤 직무의 구성원이 참여하는지, AI를 어느 정도 사용해봤는지 확인합니다</dd></div><div><dt>실습할 업무와 자료</dt><dd>자주 다루는 문서와 업무를 정합니다 개인정보나 비공개 자료는 제외하고 실습용 예시를 준비합니다</dd></div><div><dt>일정과 실습 환경</dt><dd>교육 시간과 장소, PC와 계정 사용 가능 여부를 확인해 실습 범위를 조정합니다</dd></div></dl></div>
    </section>

    <section class="geo-section geo-section-alt" aria-labelledby="education-faq-heading">
        <div class="geo-wrap geo-wrap-narrow aj-service-split"><div class="aj-service-heading"><span class="geo-section-badge">자주 묻는 질문</span><h2 id="education-faq-heading">교육을 준비하며<br>궁금하실 내용</h2></div><div class="aj-service-faq"><details><summary>AI를 처음 써보는 사람도 참여할 수 있나요?</summary><p>처음 시작하는 참여자에 맞춰 기초부터 구성할 수 있습니다 사전에 사용 경험을 확인하고 질문 작성과 간단한 실습부터 진행합니다</p></details><details><summary>우리 기관의 문서로 실습할 수 있나요?</summary><p>자료를 확인한 뒤 교육용 예시로 구성합니다 개인정보나 비공개 내용은 제거하고 사용 가능한 범위를 담당자와 먼저 정합니다</p></details><details><summary>특정 AI 도구를 정해놓고 교육하나요?</summary><p>교육 목적과 기관의 사용 환경에 맞춰 정합니다 유료 계정이 필요한 도구를 사용하는 경우에는 준비 사항을 사전에 안내합니다</p></details><details><summary>교육 시간과 비용은 어떻게 정하나요?</summary><p>대상 인원, 직무와 수준, 교육 목표와 시간, 실습 운영 방식을 확인한 뒤 제안합니다</p></details></div></div>
    </section>
    <?php get_template_part('template-parts/service-contact'); ?>
</div>
<?php get_footer(); ?>
