<?php
/** GEO homepage using the existing AIJeong theme header and footer. */
get_header();
$theme_uri = get_template_directory_uri();
$site = aijeong_get_site_config();
?>
<div class="geo-home">
    <section class="geo-hero relative min-h-screen flex items-center -mt-16 md:-mt-20 overflow-hidden bg-black" aria-labelledby="geo-hero-heading">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" style="background-image:url('<?php echo esc_url($theme_uri); ?>/assets/images/geo-hero-background.png')"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div class="geo-wrap geo-hero-inner relative z-10">
            <div class="max-w-2xl pt-20">
                <span class="hero-badge inline-block px-4 py-1.5 rounded-full border border-accent/30 text-sm font-medium text-accent mb-6">AI 검색 최적화 · GEO</span>
                <h1 id="geo-hero-heading" class="hero-title text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">AI 검색에 맞춰<br>브랜드를 다시 설계합니다</h1>
                <p class="hero-subtitle mt-5 text-lg md:text-xl font-bold text-white">브랜드를 찾는 고객의 질문부터 확인합니다</p>
                <p class="hero-description mt-3 text-base md:text-lg text-gray-300 leading-relaxed">AI 검색에서 우리 브랜드가 어떻게 소개되는지 살펴보고<br class="geo-desktop-break">브랜드 정보와 콘텐츠를 정리합니다</p>
                <div class="hero-cta geo-hero-actions mt-8">
                    <a class="geo-button geo-button-primary" href="#contact" data-interest="GEO">문의하기</a>
                    <a class="geo-button geo-button-outline" href="#services">서비스 알아보기</a>
                </div>
            </div>
        </div>
    </section>

    <div id="clients">
        <?php get_template_part('template-parts/home/section', 'clients'); ?>
    </div>

    <section class="geo-section geo-section-alt" aria-labelledby="geo-question-heading">
        <div class="geo-wrap">
            <div class="geo-section-heading">
                <span class="geo-section-badge">GEO</span>
                <h2 id="geo-question-heading">AI는 우리 브랜드를<br>어떻게 소개하고 있을까요?</h2>
                <p>고객이 검색할 질문으로 브랜드의 현재 모습을 확인합니다</p>
            </div>
            <div class="geo-checks">
                <div><span>01</span><h3>검색에 나오는지</h3><p>고객의 질문에 우리 브랜드가<br>소개되는지 확인합니다</p></div>
                <div><span>02</span><h3>정보가 맞는지</h3><p>서비스와 브랜드 정보가<br>실제 내용과 일치하는지 살펴봅니다</p></div>
                <div><span>03</span><h3>참고할 내용이 있는지</h3><p>공식 홈페이지에 필요한 정보와<br>설명이 갖춰져 있는지 점검합니다</p></div>
            </div>
        </div>
    </section>

    <section class="geo-section" id="services" aria-labelledby="geo-services-heading">
        <div class="geo-wrap geo-wrap-narrow">
            <div class="geo-section-heading">
                <span class="geo-section-badge">서비스</span>
                <h2 id="geo-services-heading">에이정의 서비스</h2>
                <p>GEO, 웹사이트 리뉴얼, AI교육<br>서비스별로 필요한 작업을 맡습니다</p>
            </div>
            <div class="geo-services">
                <article class="geo-card" id="geo">
                    <div class="geo-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></div>
                    <p class="geo-card-label">AI 검색 최적화 · AEO</p>
                    <h3>GEO</h3>
                    <p>고객이 어떤 질문으로 서비스를 찾는지 살펴봅니다<br>AI의 답변을 확인한 뒤 브랜드 소개와 서비스 콘텐츠를 정리합니다</p>
                    <ul class="geo-service-list"><li>검색 현황 진단</li><li>브랜드·서비스 정보 정리</li><li>콘텐츠 설계와 보완</li><li>검색 변화 확인</li></ul>
                    <div class="geo-card-actions"><a class="geo-link" href="<?php echo esc_url(home_url('/geo/')); ?>">자세히 보기 <span aria-hidden="true">↗</span></a><a class="geo-link" href="#contact" data-interest="GEO">문의하기</a></div>
                </article>
                <article class="geo-card" id="website-renewal">
                    <div class="geo-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M2 7h20"/></svg></div>
                    <p class="geo-card-label">WEBSITE RENEWAL</p>
                    <h3>웹사이트 리뉴얼</h3>
                    <p>서비스의 강점과 고객이 궁금해하는 내용을 정리합니다<br>기획부터 디자인·개발까지 맡고 모바일에서도 이용하기 편한지 확인합니다</p>
                    <ul class="geo-service-list"><li>페이지·콘텐츠 기획</li><li>디자인·개발</li><li>모바일 이용 경험</li><li>검색·문의 동선 정리</li></ul>
                    <div class="geo-card-actions"><a class="geo-link" href="<?php echo esc_url(home_url('/website-renewal/')); ?>">자세히 보기 <span aria-hidden="true">↗</span></a><a class="geo-link" href="#contact" data-interest="웹사이트 리뉴얼">문의하기</a></div>
                </article>
                <article class="geo-card" id="ai-education">
                    <div class="geo-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m2 8 10-5 10 5-10 5L2 8Z"/><path d="M6 10v7c4 3 8 3 12 0v-7M22 8v8"/></svg></div>
                    <p class="geo-card-label">업무에 적용하는 실습</p>
                    <h3>AI교육</h3>
                    <p>기업과 기관의 실제 업무에 맞춰 교육을 구성합니다<br>직접 만들고 검토하며 다시 쓸 수 있는 활용 방법을 익힙니다</p>
                    <ul class="geo-service-list"><li>직무·수준별 교육</li><li>업무 문서 실습</li><li>자료조사·결과 검토</li><li>업무 적용 방법</li></ul>
                    <div class="geo-card-actions"><a class="geo-link" href="<?php echo esc_url(home_url('/ai-education/')); ?>">자세히 보기 <span aria-hidden="true">↗</span></a><a class="geo-link" href="#contact" data-interest="AI교육">문의하기</a></div>
                </article>
            </div>
        </div>
    </section>

    <section class="geo-section geo-section-alt" id="approach" aria-labelledby="geo-process-heading">
        <div class="geo-wrap geo-wrap-narrow">
            <div class="geo-section-heading"><span class="geo-section-badge">진행 순서</span><h2 id="geo-process-heading">GEO는 이렇게 진행합니다</h2><p>고객이 검색할 질문과 브랜드 정보를 확인한 뒤 작업 범위를 정합니다</p></div>
            <ol class="geo-process">
                <li><span>01</span><h3>현황 확인</h3><p>사업과 고객, 검색 상황<br>웹사이트를 확인합니다</p></li>
                <li><span>02</span><h3>개선 계획</h3><p>무엇을 누구에게 전달할지<br>어디부터 고칠지 정합니다</p></li>
                <li><span>03</span><h3>정보·콘텐츠 정리</h3><p>브랜드 소개와 콘텐츠를 고치고<br>필요한 웹사이트 작업을 진행합니다</p></li>
                <li><span>04</span><h3>결과 점검</h3><p>검색 결과와 방문, 문의를 살펴보고<br>부족한 부분을 고칩니다</p></li>
            </ol>
        </div>
    </section>

    <section class="geo-section geo-section-alt" id="about" aria-labelledby="geo-about-heading">
        <div class="geo-wrap geo-wrap-narrow">
            <div class="geo-section-heading"><span class="geo-section-badge">에이정 소개</span><h2 id="geo-about-heading">에이정은 이런 회사입니다</h2></div>
            <div class="geo-about"><p>에이정은 기업과 조직에 AI를 소개하고 실제 업무에 적용하는 교육을 진행해 왔습니다</p><p>GEO를 중심으로 브랜드 정보와 콘텐츠를 정리합니다<br>웹사이트 리뉴얼은 이 과정에서 필요한 서비스 중 하나입니다</p><a class="geo-link" href="<?php echo esc_url(home_url('/ai-education/')); ?>">AI교육 자세히 보기 <span aria-hidden="true">↗</span></a></div>
        </div>
    </section>

    <section class="geo-section" id="contact" aria-labelledby="geo-contact-heading">
        <div class="geo-wrap geo-wrap-form">
            <div class="geo-section-heading"><span class="geo-section-badge">서비스 문의</span><h2 id="geo-contact-heading">어떤 도움이<br>필요하신가요?</h2><p>문의하실 서비스와 궁금한 점을 남겨주세요<br>내용을 확인하고 회신드리겠습니다</p></div>
            <form id="contact-form" class="geo-contact-form">
                <fieldset><legend>문의하실 서비스를 선택해 주세요</legend><div class="geo-interests">
                    <label><input type="radio" name="interest" value="GEO" checked><span>GEO</span></label>
                    <label><input type="radio" name="interest" value="웹사이트 리뉴얼"><span>웹사이트 리뉴얼</span></label>
                    <label><input type="radio" name="interest" value="함께 검토"><span>상담 후 결정</span></label>
                    <label><input type="radio" name="interest" value="AI교육"><span>AI교육</span></label>
                </div></fieldset>
                <div class="geo-form-row"><label for="company">회사·브랜드명 <span>*</span><input id="company" name="company" autocomplete="organization" placeholder="회사 또는 브랜드명" required maxlength="120"></label><label for="reply">회신 받을 이메일 <span>*</span><input id="reply" name="reply" type="email" autocomplete="email" placeholder="name@company.com" required maxlength="180"></label></div>
                <label for="website">홈페이지 주소 <span class="geo-optional">선택</span><input id="website" name="website" type="url" placeholder="https://" maxlength="500"></label>
                <label for="message">문의 내용 <span>*</span><textarea id="message" name="message" placeholder="고치고 싶은 부분이나 궁금한 점을 적어주세요" required rows="4" maxlength="3000"></textarea></label>
                <p class="geo-form-note">문의 버튼을 누르면 이메일 앱이 열립니다<br>작성한 내용을 확인하고 보내기를 눌러주세요</p>
                <button class="geo-button geo-button-primary geo-form-submit" type="submit">문의하기</button>
                <p id="form-status" class="geo-form-status" role="status" hidden></p>
                <a id="email-fallback" class="geo-link" href="mailto:<?php echo esc_attr($site['email']); ?>" hidden>이메일 앱 다시 열기 ↗</a>
            </form>
        </div>
    </section>
</div>
<?php get_footer(); ?>
