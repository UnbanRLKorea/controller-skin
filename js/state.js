// 기본 레이아웃: 각 버튼의 기본 텍스트 설정
window.baseLayouts = {
    "btn-4": "L", "btn-5": "R",
    "btn-12": "↑", "btn-13": "↓", "btn-14": "←", "btn-15": "→"
};

// 상태 구조: g(글로벌 테마), l(개별 오버라이드), m(매핑), s(옵션), c(컨트롤러 바디)
// 색상 형식: #RRGGBBAA (RGBA 헥사데시멀) - 마지막 2자리가 투명도 (00=완전 투명, FF=완전 불투명)
window.appState = {
    m: {}, l: {}, s: { showStickLine: false },
    g: { bgC: '#444444FF', efC: '#00ff88FF', txtC: '#888888FF', txtAC: '#000000FF', bgI: '', efI: '' },
    c: { bgC: '#222222FF', bgI: '', w: 500, h: 300 }
};

window.baseVisuals = {
    "btn-0": window.t("b_a"), "btn-1": window.t("b_b"), "btn-2": window.t("b_x"), "btn-3": window.t("b_y"),
    "btn-4": window.t("b_lb_f"), "btn-5": window.t("b_rb_f"),
    "trigger-box-6": window.t("b_lt_f"), "trigger-box-7": window.t("b_rt_f"),
    "btn-8": window.t("b_sel"), "btn-16": window.t("b_home"), "btn-9": window.t("b_str"),
    "stick-l": window.t("b_l3"), "stick-r": window.t("b_r3"),
    "btn-12": window.t("b_up"), "btn-13": window.t("b_dn"), "btn-14": window.t("b_l"), "btn-15": window.t("b_r")
};

window.hardwareInputNames = {
    0: window.t("b_a"), 1: window.t("b_b"), 2: window.t("b_x"), 3: window.t("b_y"),
    4: window.t("b_lb"), 5: window.t("b_rb"), 6: window.t("b_lt"), 7: window.t("b_rt"),
    8: window.t("b_sel"), 9: window.t("b_str"), 10: window.t("b_l3"), 11: window.t("b_r3"),
    12: window.t("b_up"), 13: window.t("b_dn"), 14: window.t("b_l"), 15: window.t("b_r"),
    16: window.t("b_home"), 17: window.t("b_cap")
};

window.saveToURL = function() {
    try {
       // [자동 압축 로직] 인코딩하기 직전에 개별 버튼 데이터(l)를 순회하며 글로벌(g)과 겹치거나 비어있는 찌꺼기를 날려버립니다.
       if (window.appState.l && window.appState.g) {
           const g = window.appState.g;
           for (const id in window.appState.l) {
               const l = window.appState.l[id];
               if (l.bgC && l.bgC.toLowerCase() === g.bgC.toLowerCase()) delete l.bgC;
               if (l.efC && l.efC.toLowerCase() === g.efC.toLowerCase()) delete l.efC;
               if (l.txtC && l.txtC.toLowerCase() === g.txtC.toLowerCase()) delete l.txtC;
               if (l.txtAC && l.txtAC.toLowerCase() === g.txtAC.toLowerCase()) delete l.txtAC;
               if (!l.bgI || l.bgI === g.bgI) delete l.bgI;
               if (!l.efI || l.efI === g.efI) delete l.efI;
               if (!l.t) delete l.t;
           }
       }

        const b64 = btoa(encodeURIComponent(JSON.stringify(window.appState))); 
        const url = new URL(window.location.href);
        url.searchParams.set('cfg', b64);
        window.history.replaceState({}, '', url);
    } catch(e) {
        alert(window.t("msg_url_error"));
    }
};

window.loadFromURL = function() {
    const cfg = new URLSearchParams(window.location.search).get('cfg');
    if (cfg) {
        try {
            window.appState = JSON.parse(decodeURIComponent(atob(cfg)));
            if (!window.appState.m) window.appState.m = {};
            if (!window.appState.l) window.appState.l = {};
            if (!window.appState.s) window.appState.s = { showStickLine: false };
            if (!window.appState.g) window.appState.g = { bgC: '#444444CC', efC: '#00ff88CC', txtC: '#888888CC', txtAC: '#000000CC', bgI: '', efI: '' };
            if (!window.appState.c) window.appState.c = { bgC: '#222222FF', bgI: '', w: 500, h: 300 };
        } catch(e) {}
    }
};

// RGBA 헥사데시멀 (#RRGGBBAA)을 CSS rgba() 문자열로 변환
function hexAtoRGBA(hexA) {
    if (!hexA || hexA.length !== 9) return hexA; // 유효하지 않은 형식은 그대로 반환
    const r = parseInt(hexA.slice(1, 3), 16);
    const g = parseInt(hexA.slice(3, 5), 16);
    const b = parseInt(hexA.slice(5, 7), 16);
    const a = parseInt(hexA.slice(7, 9), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

// [NEW] 개별 객체에 CSS 변수를 찔러넣어 색상/이미지를 적용하는 핵심 함수
window.applyCustomization = function(id) {
    let targetDomId = id;
    if (id === 'stick-l') targetDomId = 'area-stick-l';
    if (id === 'stick-r') targetDomId = 'area-stick-r';
    
    let el = document.getElementById(targetDomId);
    if(!el) return;

    let l = window.appState.l[id] || {};
    let g = window.appState.g;

    // 우선순위: 개별 오버라이드 값(l) > 글로벌 테마 값(g) > 하드코딩 기본값
    let bgC = l.bgC || g.bgC || '#444444CC';
    let efC = l.efC || g.efC || '#00ff88CC';
    let txtC = l.txtC || g.txtC || '#888888CC';
    let txtAC = l.txtAC || g.txtAC || '#000000CC';
    
    let bgI = l.bgI ? `url(${l.bgI})` : (g.bgI ? `url(${g.bgI})` : 'none');
    let efI = l.efI ? `url(${l.efI})` : (g.efI ? `url(${g.efI})` : 'none');

    // 스틱 헤드의 색상 적용을 위한 예외 타겟팅
    let applyTarget = el;
    if (id.includes('stick-')) applyTarget = document.getElementById(id); // wrapper인 stick-l, stick-r 지목

    applyTarget.style.setProperty('--bg-color', hexAtoRGBA(bgC));
    applyTarget.style.setProperty('--bg-image', bgI);
    applyTarget.style.setProperty('--effect-color', hexAtoRGBA(efC));
    applyTarget.style.setProperty('--glow-color', hexAtoRGBA(efC));
    applyTarget.style.setProperty('--effect-image', efI);
    applyTarget.style.setProperty('--text-color', hexAtoRGBA(txtC));
    applyTarget.style.setProperty('--text-active-color', hexAtoRGBA(txtAC));
};

window.applyAllCustomizations = function() {
    // 기본 객체 순회
    Object.keys(window.baseVisuals).forEach(id => window.applyCustomization(id));
    // 커스텀 객체 순회
    Object.keys(window.appState.l).forEach(id => {
        if(window.appState.l[id].c) window.applyCustomization(id);
    });
    // 컨트롤러 바디 적용
    const controller = document.getElementById('gamepad-ui');
    if (controller && window.appState.c) {
        let bgI = window.appState.c.bgI ? `url(${window.appState.c.bgI})` : 'none';
        let bgC = bgI === 'none' ? (window.appState.c.bgC || '#222222') : 'transparent';
        controller.style.setProperty('--controller-bg-color', bgC);
        controller.style.setProperty('--controller-bg-image', bgI);
        // 이미지가 지정되면 그림자 제거, 없으면 기본 그림자 유지
        controller.style.setProperty('--controller-shadow', bgI === 'none' ? '0 10px 30px rgba(0,0,0,0.5)' : 'none');
        // 이미지가 지정되면 모서리 제거하여 이미지 전체 표시, 아니면 기본 둥근 모서리 유지
        controller.style.setProperty('--controller-border-radius', bgI === 'none' ? '100px 100px 50px 50px' : '0');
        // 너비/높이 적용
        let w = window.appState.c.w;
        let h = window.appState.c.h;
        if (w !== undefined && w !== '') controller.style.width = w + 'px';
        if (h !== undefined && h !== '') controller.style.height = h + 'px';
    }
};
