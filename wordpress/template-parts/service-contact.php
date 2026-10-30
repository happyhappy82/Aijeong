<?php
$service = aijeong_current_service();
if (!$service) {
    return;
}
$prompts = array(
    'geo' => array('우리 브랜드는 어디부터 바꾸면 좋을까요?', '브랜드명과 홈페이지, 궁금한 점을 남겨주세요', '현재 상태를 살펴보고 필요한 작업부터 정리합니다'),
    'website-renewal' => array('지금 홈페이지에서 바꾸고 싶은 부분이 있나요?', '홈페이지 주소와 개선하고 싶은 내용을 알려주세요', '살릴 내용과 고칠 부분을 함께 살펴봅니다'),
    'ai-education' => array('우리 조직에는 어떤 AI교육이 필요할까요?', '교육 대상과 인원, 다뤄보고 싶은 업무를 알려주세요', '참여자의 수준과 일정에 맞춰 교육 내용을 제안합니다'),
);
$prompt = $prompts[$service['slug']];
?>
<section class="geo-section aj-service-contact" aria-labelledby="service-contact-heading">
    <div class="geo-wrap geo-wrap-narrow">
        <span class="geo-section-badge"><?php echo esc_html($service['name']); ?> 문의</span>
        <h2 id="service-contact-heading"><?php echo esc_html($prompt[0]); ?></h2>
        <p><?php echo esc_html($prompt[1]); ?><br><?php echo esc_html($prompt[2]); ?></p>
        <a class="geo-button geo-button-primary" href="<?php echo esc_url(aijeong_service_inquiry_url($service['slug'])); ?>">문의하기</a>
    </div>
</section>
