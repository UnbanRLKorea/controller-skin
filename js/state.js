// 상태 구조: g(글로벌 테마), l(개별 오버라이드), m(매핑), s(옵션), c(컨트롤러 바디)
window.appState = {
    m: {}, l: {}, s: { showStickLine: false },
    g: { bgC: '#444444', efC: '#00ff88', txtC: '#888888', txtAC: '#000000', bgI: '', efI: '' },
    c: { bgC: '#222222', bgI: '', w: 500, h: 300 }
};

window.baseVisuals = {
    "btn-0": "A 버튼", "btn-1": "B 버튼", "btn-2": "X 버튼", "btn-3": "Y 버튼",
    "btn-4": "LB (좌측 범퍼)", "btn-5": "RB (우측 범퍼)",
    "trigger-box-6": "LT (좌측 트리거)", "trigger-box-7": "RT (우측 트리거)",
    "btn-8": "Select / Back", "btn-16": "Home / Guide", "btn-9": "Start / Menu",
    "stick-l": "L3 (좌스틱 클릭)", "stick-r": "R3 (우스틱 클릭)",
    "btn-12": "십자 상", "btn-13": "십자 하", "btn-14": "십자 좌", "btn-15": "십자 우"
};

window.hardwareInputNames = {
    0: "A 버튼", 1: "B 버튼", 2: "X 버튼", 3: "Y 버튼",
    4: "LB", 5: "RB", 6: "LT", 7: "RT",
    8: "Select / Back", 9: "Start / Menu", 
    10: "L3 (좌스틱 클릭)", 11: "R3 (우스틱 클릭)",
    12: "십자 상", 13: "십자 하", 14: "십자 좌", 15: "십자 우",
    16: "Home / Guide", 17: "Capture / Share"
};

window.saveToURL = function() {
    try {
        const b64 = btoa(encodeURIComponent(JSON.stringify(window.appState))); 
        const url = new URL(window.location.href);
        url.searchParams.set('cfg', b64);
        window.history.replaceState({}, '', url);
    } catch(e) {
        alert("저장 실패! 이미지 URL이 너무 길어 주소창 용량을 초과했습니다. 짧은 URL로 변경해주세요.");
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
            if (!window.appState.g) window.appState.g = { bgC: '#444444', efC: '#00ff88', txtC: '#888888', txtAC: '#000000', bgI: '', efI: '' };
            if (!window.appState.c) window.appState.c = { bgC: '#222222', bgI: '', w: 500, h: 300 };
        } catch(e) {}
    }
};

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
    let bgC = l.bgC || g.bgC || '#444444';
    let efC = l.efC || g.efC || '#00ff88';
    let txtC = l.txtC || g.txtC || '#888888';
    let txtAC = l.txtAC || g.txtAC || '#000000';
    
    let bgI = l.bgI ? `url(${l.bgI})` : (g.bgI ? `url(${g.bgI})` : 'none');
    let efI = l.efI ? `url(${l.efI})` : (g.efI ? `url(${g.efI})` : 'none');

    // 스틱 헤드의 색상 적용을 위한 예외 타겟팅
    let applyTarget = el;
    if (id.includes('stick-')) applyTarget = document.getElementById(id); // wrapper인 stick-l, stick-r 지목

    applyTarget.style.setProperty('--bg-color', bgC);
    applyTarget.style.setProperty('--bg-image', bgI);
    applyTarget.style.setProperty('--effect-color', efC);
    applyTarget.style.setProperty('--glow-color', efC);
    applyTarget.style.setProperty('--effect-image', efI);
    applyTarget.style.setProperty('--text-color', txtC);
    applyTarget.style.setProperty('--text-active-color', txtAC);
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
