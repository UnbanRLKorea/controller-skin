window.isEditMode = false;

window.applyLayouts = function() {
    document.querySelectorAll('.custom-added-btn').forEach(el => el.remove());
    const container = document.getElementById('gamepad-ui');

    for (const [id, layout] of Object.entries(window.appState.l)) {
        let targetDomId = id;
        if (id === 'stick-l') targetDomId = 'area-stick-l';
        if (id === 'stick-r') targetDomId = 'area-stick-r';
        
        let el = document.getElementById(targetDomId);

        if (!el && layout.c) {
            el = document.createElement('div');
            el.id = targetDomId; 
            el.className = 'btn-wrapper custom-added-btn';
            el.innerHTML = `<div class="layer-physical"></div><div class="layer-effect"></div><div class="btn-text"></div>`;
            container.appendChild(el);
        }
        
        if (el) {
            el.style.left = layout.x + 'px'; el.style.top = layout.y + 'px';
            el.style.width = layout.w + 'px'; el.style.height = layout.h + 'px';
            if (layout.r !== undefined && layout.r !== '') el.style.borderRadius = layout.r + 'px';
            el.style.right = 'auto'; el.style.bottom = 'auto';
            
            // 텍스트 적용: 개별 설정 > 기본 텍스트(baseLayouts) 순서로 적용
            if (!targetDomId.includes('area-stick') && !targetDomId.includes('trigger-box')) {
                const textNode = el.querySelector('.btn-text');
                if(textNode) {
                    let text = layout.t;
                    // 개별 텍스트 설정이 없을 때 기본 텍스트 적용
                    if (text === undefined && window.baseLayouts && window.baseLayouts[id]) {
                        text = window.baseLayouts[id];
                    }
                    textNode.innerText = text || '';
                }
            }
        }
    }
    window.applyAllCustomizations(); 
};

const layoutTarget = document.getElementById('layout-target');
const mapSrc = document.getElementById('map-src');
const mapTgt = document.getElementById('map-tgt');
const btnResetLayout = document.getElementById('btn-reset-layout');
const toggleStickLine = document.getElementById('toggle-stick-line');

// [버그 수정] 탭 전환 기능: e.target 대신 e.currentTarget 사용
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetPaneId = e.currentTarget.getAttribute('data-target');
        if (!targetPaneId) return;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        e.currentTarget.classList.add('active');
        const targetElement = document.getElementById(targetPaneId);
        if (targetElement) targetElement.classList.add('active');
    });
});

window.populateDropdowns = function() {
    const currentValue = layoutTarget.value;
    layoutTarget.innerHTML = ''; mapTgt.innerHTML = '';
    
    Object.entries(window.baseVisuals).forEach(([val, name]) => {
        layoutTarget.add(new Option(`${window.t("opt_base")} ${name}`, val));
        mapTgt.add(new Option(`${window.t("opt_visual")} ${name}`, val));
    });
    for (const [id, layout] of Object.entries(window.appState.l)) {
        if (layout.c) {
            const customName = layout.t || id;
            layoutTarget.add(new Option(`${window.t("opt_custom")} ${customName}`, id));
            mapTgt.add(new Option(`${window.t("opt_visual")} ${customName}`, id));
        }
    }
    if (currentValue && Array.from(layoutTarget.options).some(opt => opt.value === currentValue)) {
        layoutTarget.value = currentValue;
    }
    
    if(mapSrc.options.length === 0) {
        for (let i = 0; i <= 31; i++) {
            const displayName = window.hardwareInputNames[i] || window.t("b_extra");
            mapSrc.add(new Option(`${window.t("opt_input")} ${displayName} (${i})`, i));
        }
    }
    toggleStickLine.checked = window.appState.s.showStickLine;
};

toggleStickLine.addEventListener('change', (e) => {
    window.appState.s.showStickLine = e.target.checked;
    window.saveToURL();
});

function loadLayoutIntoInputs() {
    const id = layoutTarget.value;
    let targetDomId = id;
    if (id === 'stick-l') targetDomId = 'area-stick-l';
    if (id === 'stick-r') targetDomId = 'area-stick-r';
    const el = document.getElementById(targetDomId);
    
    const l = window.appState.l[id] || {};
    const g = window.appState.g;

    document.getElementById('edit-x').value = l.x !== undefined ? l.x : (el ? el.offsetLeft : 0);
    document.getElementById('edit-y').value = l.y !== undefined ? l.y : (el ? el.offsetTop : 0);
    document.getElementById('edit-w').value = l.w !== undefined ? l.w : (el ? el.offsetWidth : 40);
    document.getElementById('edit-h').value = l.h !== undefined ? l.h : (el ? el.offsetHeight : 40);
    
    const currentRadius = el ? parseInt(window.getComputedStyle(el).borderRadius) : 50;
    document.getElementById('edit-r').value = l.r !== undefined ? l.r : (isNaN(currentRadius) ? 50 : currentRadius);
    
    const textInput = document.getElementById('edit-text');
    if (targetDomId.includes('area-stick') || targetDomId.includes('trigger-box')) {
        textInput.value = ''; textInput.disabled = true; textInput.placeholder = window.t("ph_text_disabled");
    } else {
        const textNode = el ? el.querySelector('.btn-text') : null;
        textInput.value = l.t !== undefined ? l.t : (textNode ? textNode.innerText : '');
        textInput.disabled = false; textInput.placeholder = window.t("ph_text");
    }

    // RGBA 헥사데시멀 (#RRGGBBAA)에서 색상과 alpha 분리
    function parseHexA(hexA) {
        if (!hexA || hexA.length !== 9) return { color: hexA || '#000000', alpha: 1.0 };
        const r = parseInt(hexA.slice(1, 3), 16);
        const g = parseInt(hexA.slice(3, 5), 16);
        const b = parseInt(hexA.slice(5, 7), 16);
        const a = parseInt(hexA.slice(7, 9), 16) / 255;
        // RGB를 CSS color input 형식 (#RRGGBB)으로 변환
        const color = '#' + hexA.slice(1, 7);
        return { color, alpha: a };
    }
    
    const bgParsed = parseHexA(l.bgC || g.bgC);
    const efParsed = parseHexA(l.efC || g.efC);
    const txtCParsed = parseHexA(l.txtC || g.txtC);
    const txtACParsed = parseHexA(l.txtAC || g.txtAC);
    
    document.getElementById('edit-bgC').value = bgParsed.color;
    document.getElementById('edit-bgC-alpha').value = bgParsed.alpha;
    document.getElementById('edit-efC').value = efParsed.color;
    document.getElementById('edit-efC-alpha').value = efParsed.alpha;
    document.getElementById('edit-txtC').value = txtCParsed.color;
    document.getElementById('edit-txtC-alpha').value = txtCParsed.alpha;
    document.getElementById('edit-txtAC').value = txtACParsed.color;
    document.getElementById('edit-txtAC-alpha').value = txtACParsed.alpha;
    document.getElementById('edit-bgI').value = l.bgI || '';
    document.getElementById('edit-efI').value = l.efI || '';

    if (l.c) { 
        btnResetLayout.innerText = window.t("btn_reset_custom"); btnResetLayout.className = "btn-danger";
    } else { 
        btnResetLayout.innerText = window.t("btn_reset_base"); btnResetLayout.className = "btn-secondary";
    }

    document.querySelectorAll('.active-edit-target').forEach(e => e.classList.remove('active-edit-target'));
    if (el) el.classList.add('active-edit-target');
}

function updateLayoutRealtime() {
    const id = layoutTarget.value;
    if(!window.appState.l[id]) window.appState.l[id] = {};
    const l = window.appState.l[id];

    l.x = parseInt(document.getElementById('edit-x').value) || 0;
    l.y = parseInt(document.getElementById('edit-y').value) || 0;
    l.w = parseInt(document.getElementById('edit-w').value) || 40;
    l.h = parseInt(document.getElementById('edit-h').value) || 40;
    l.r = parseInt(document.getElementById('edit-r').value) || 0;
    l.t = document.getElementById('edit-text').value;

    // 색상과 alpha를 결합하여 #RRGGBBAA 형식으로 저장
    function combineColorAlpha(color, alpha) {
        const a = Math.round(parseFloat(alpha) * 255).toString(16).padStart(2, '0');
        return color + a;
    }
    
    const bgC = document.getElementById('edit-bgC').value;
    const bgAlpha = document.getElementById('edit-bgC-alpha').value;
    if(bgC + bgAlpha !== window.appState.g.bgC) l.bgC = combineColorAlpha(bgC, bgAlpha); else delete l.bgC;
    
    const efC = document.getElementById('edit-efC').value;
    const efAlpha = document.getElementById('edit-efC-alpha').value;
    if(efC + efAlpha !== window.appState.g.efC) l.efC = combineColorAlpha(efC, efAlpha); else delete l.efC;
    
    const txtC = document.getElementById('edit-txtC').value;
    const txtCAlpha = document.getElementById('edit-txtC-alpha').value;
    if(txtC + txtCAlpha !== window.appState.g.txtC) l.txtC = combineColorAlpha(txtC, txtCAlpha); else delete l.txtC;
    
    const txtAC = document.getElementById('edit-txtAC').value;
    const txtACAlpha = document.getElementById('edit-txtAC-alpha').value;
    if(txtAC + txtACAlpha !== window.appState.g.txtAC) l.txtAC = combineColorAlpha(txtAC, txtACAlpha); else delete l.txtAC;
    
    l.bgI = document.getElementById('edit-bgI').value || undefined;
    l.efI = document.getElementById('edit-efI').value || undefined;

    window.applyLayouts(); 
    loadLayoutIntoInputs(); 
}

// 각 버튼별 기본 레이아웃 값 (CSS와 일치)
const DEFAULT_LAYOUTS = {
    "btn-0": { x: 390, y: 115, w: 40, h: 40, r: 50 },
    "btn-1": { x: 430, y: 75, w: 40, h: 40, r: 50 },
    "btn-2": { x: 350, y: 75, w: 40, h: 40, r: 50 },
    "btn-3": { x: 390, y: 35, w: 40, h: 40, r: 50 },
    "btn-4": { x: 70, y: -10, w: 80, h: 25, r: 8 },
    "btn-5": { x: 350, y: -10, w: 80, h: 25, r: 8 },
    "btn-8": { x: 190, y: 75, w: 30, h: 20, r: 10 },
    "btn-9": { x: 280, y: 75, w: 30, h: 20, r: 10 },
    "btn-12": { x: 150, y: 145, w: 30, h: 30, r: 5 },
    "btn-13": { x: 150, y: 205, w: 30, h: 30, r: 5 },
    "btn-14": { x: 120, y: 175, w: 30, h: 30, r: 5 },
    "btn-15": { x: 180, y: 175, w: 30, h: 30, r: 5 },
    "btn-16": { x: 232, y: 80, w: 36, h: 10, r: 5 },
    "stick-l": { x: 60, y: 55, w: 80, h: 80, r: 50 },
    "stick-r": { x: 300, y: 150, w: 80, h: 80, r: 50 },
    "trigger-box-6": { x: 80, y: -80, w: 40, h: 60, r: 5 },
    "trigger-box-7": { x: 380, y: -80, w: 40, h: 60, r: 5 }
};

window.resetLayoutOnly = function() {
    const id = layoutTarget.value;
    if (!window.appState.l[id]) return;
    
    // 색상/이미지 설정은 유지하고 위치/크기만 초기화
    const colors = {};
    if (window.appState.l[id].bgC !== undefined) colors.bgC = window.appState.l[id].bgC;
    if (window.appState.l[id].efC !== undefined) colors.efC = window.appState.l[id].efC;
    if (window.appState.l[id].txtC !== undefined) colors.txtC = window.appState.l[id].txtC;
    if (window.appState.l[id].txtAC !== undefined) colors.txtAC = window.appState.l[id].txtAC;
    if (window.appState.l[id].bgI !== undefined) colors.bgI = window.appState.l[id].bgI;
    if (window.appState.l[id].efI !== undefined) colors.efI = window.appState.l[id].efI;
    const isCustom = window.appState.l[id].c === true;
    const text = window.appState.l[id].t !== undefined ? window.appState.l[id].t : undefined;
    
    // 각 버튼별 기본 레이아웃 값 적용
    const defaults = DEFAULT_LAYOUTS[id];
    if (defaults) {
        window.appState.l[id].x = defaults.x;
        window.appState.l[id].y = defaults.y;
        window.appState.l[id].w = defaults.w;
        window.appState.l[id].h = defaults.h;
        window.appState.l[id].r = defaults.r;
    } else {
        // 커스텀 버튼인 경우 기본값 적용
        window.appState.l[id].x = 0;
        window.appState.l[id].y = 0;
        window.appState.l[id].w = 40;
        window.appState.l[id].h = 40;
        window.appState.l[id].r = 50;
    }
    
    // 색상/이미지 복원
    Object.assign(window.appState.l[id], colors);
    if (isCustom) {
        window.appState.l[id].c = true;
    } else {
        // 기본 버튼인 경우 c 속성 제거 (undefined로 만듦)
        delete window.appState.l[id].c;
    }
    if (text !== undefined) window.appState.l[id].t = text;
    
    window.applyLayouts();
    loadLayoutIntoInputs();
    window.saveToURL();
};

const inputs = ['edit-x','edit-y','edit-w','edit-h','edit-r','edit-text', 'edit-bgC','edit-efC','edit-txtC','edit-txtAC','edit-bgI','edit-efI'];
inputs.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', updateLayoutRealtime);
});

document.getElementById('btn-apply-global').addEventListener('click', () => {
    const g = window.appState.g;
    
    // 색상과 alpha를 결합하여 #RRGGBBAA 형식으로 저장
    function combineColorAlpha(color, alpha) {
        const a = Math.round(parseFloat(alpha) * 255).toString(16).padStart(2, '0');
        return color + a;
    }
    
    g.bgC = combineColorAlpha(document.getElementById('edit-bgC').value, document.getElementById('edit-bgC-alpha').value);
    g.efC = combineColorAlpha(document.getElementById('edit-efC').value, document.getElementById('edit-efC-alpha').value);
    g.txtC = combineColorAlpha(document.getElementById('edit-txtC').value, document.getElementById('edit-txtC-alpha').value);
    g.txtAC = combineColorAlpha(document.getElementById('edit-txtAC').value, document.getElementById('edit-txtAC-alpha').value);
    g.bgI = document.getElementById('edit-bgI').value;
    g.efI = document.getElementById('edit-efI').value;

    Object.keys(window.appState.l).forEach(key => {
        delete window.appState.l[key].bgC; delete window.appState.l[key].efC;
        delete window.appState.l[key].txtC; delete window.appState.l[key].txtAC;
        delete window.appState.l[key].bgI; delete window.appState.l[key].efI;
    });

    window.applyAllCustomizations();
    window.saveToURL();
    alert(window.t("msg_glob_applied"));
});

document.getElementById('btn-reset-design').addEventListener('click', () => {
    const id = layoutTarget.value;
    if(window.appState.l[id]) {
        delete window.appState.l[id].bgC; delete window.appState.l[id].efC;
        delete window.appState.l[id].txtC; delete window.appState.l[id].txtAC;
        delete window.appState.l[id].bgI; delete window.appState.l[id].efI;
    }
    loadLayoutIntoInputs(); window.applyCustomization(id); window.saveToURL();
});

// [추가] alpha 슬라이더에도 input 이벤트 리스너 연결
document.getElementById('edit-bgC-alpha').addEventListener('input', updateLayoutRealtime);
document.getElementById('edit-efC-alpha').addEventListener('input', updateLayoutRealtime);
document.getElementById('edit-txtC-alpha').addEventListener('input', updateLayoutRealtime);
document.getElementById('edit-txtAC-alpha').addEventListener('input', updateLayoutRealtime);

const modal = document.getElementById('settings-modal');
function toggleModal() {
    modal.classList.toggle('hidden');
    window.isEditMode = !modal.classList.contains('hidden');
    if (window.isEditMode) {
        document.body.classList.add('edit-mode');
        window.populateDropdowns(); loadLayoutIntoInputs(); renderMappingList(); loadControllerSettings();
    } else {
        document.body.classList.remove('edit-mode');
        document.querySelectorAll('.active-edit-target').forEach(e => e.classList.remove('active-edit-target'));
    }
}
window.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'c' && document.activeElement.tagName !== 'INPUT') toggleModal(); });
document.getElementById('btn-close-modal').addEventListener('click', toggleModal);
document.getElementById('btn-close-top').addEventListener('click', toggleModal);
layoutTarget.addEventListener('change', loadLayoutIntoInputs);

let isDragging = false, dragTargetId = null;
let dragStartX = 0, dragStartY = 0, elStartX = 0, elStartY = 0;

document.addEventListener('mousedown', (e) => {
    if (!window.isEditMode) return;
    if (e.target.closest('#settings-modal')) return;
    let targetNode = e.target.closest('[id]');
    if (!targetNode) return;
    let id = targetNode.id;

    if (id.includes('trigger-bar') || id.includes('layer-')) id = targetNode.parentElement.id;
    if (id.includes('trigger-bar')) id = id.replace('bar', 'box');
    if (id === 'stick-line-l' || id === 'area-stick-l') id = 'stick-l';
    if (id === 'stick-line-r' || id === 'area-stick-r') id = 'stick-r';

    if (!window.baseVisuals[id] && !(window.appState.l[id] && window.appState.l[id].c)) {
        let parentId = targetNode.parentElement?.id;
        if (parentId === 'area-stick-l') parentId = 'stick-l';
        if (parentId === 'area-stick-r') parentId = 'stick-r';
        if (parentId && (window.baseVisuals[parentId] || (window.appState.l[parentId] && window.appState.l[parentId].c))) id = parentId;
        else return; 
    }

    e.preventDefault(); isDragging = true; dragTargetId = id;
    layoutTarget.value = id; loadLayoutIntoInputs();
    if (!window.appState.l[id]) updateLayoutRealtime(); 

    dragStartX = e.clientX; dragStartY = e.clientY;
    elStartX = window.appState.l[id].x; elStartY = window.appState.l[id].y;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging || !dragTargetId) return;
    window.appState.l[dragTargetId].x = elStartX + (e.clientX - dragStartX);
    window.appState.l[dragTargetId].y = elStartY + (e.clientY - dragStartY);
    document.getElementById('edit-x').value = window.appState.l[dragTargetId].x;
    document.getElementById('edit-y').value = window.appState.l[dragTargetId].y;
    window.applyLayouts();
});

document.addEventListener('mouseup', () => {
    if (isDragging) { isDragging = false; dragTargetId = null; window.saveToURL(); }
});

document.getElementById('btn-add-custom').addEventListener('click', () => {
    const newId = 'btn-c-' + Date.now();
    window.appState.l[newId] = { x: 230, y: 150, w: 40, h: 40, r: 50, t: "NEW", c: true };
    window.applyLayouts(); window.populateDropdowns(); layoutTarget.value = newId; loadLayoutIntoInputs(); window.saveToURL();
});

btnResetLayout.addEventListener('click', () => {
    const id = layoutTarget.value;
    // 커스텀 버튼인 경우: 매핑 삭제 + 완전 삭제 (기존 동작 유지)
    if (window.appState.l[id] && window.appState.l[id].c) {
        for (const [src, tgt] of Object.entries(window.appState.m)) if (tgt === id) delete window.appState.m[src];
        delete window.appState.l[id]; 
        window.saveToURL(); 
        window.location.reload(); 
        return;
    }
    // 기본 버튼인 경우: 위치/크기만 초기화, 색상은 유지
    window.resetLayoutOnly();
});

document.getElementById('btn-apply-layout').addEventListener('click', () => {
    window.saveToURL();
    const btn = document.getElementById('btn-apply-layout');
    const originalText = btn.innerText;
    btn.innerText = window.t("msg_saved"); btn.style.background = "#3b82f6"; btn.style.color = "#fff";
    setTimeout(() => { btn.innerText = window.t("btn_save"); btn.style.background = ""; btn.style.color = ""; }, 1000);
});

document.getElementById('btn-add-map').addEventListener('click', () => {
    window.appState.m[mapSrc.value] = mapTgt.value; renderMappingList(); window.saveToURL();
});

function renderMappingList() {
    const list = document.getElementById('mapping-list'); list.innerHTML = '';
    for (const [src, tgt] of Object.entries(window.appState.m)) {
        const li = document.createElement('li');
        const srcName = mapSrc.querySelector(`option[value="${src}"]`)?.text || `신호 ${src}`;
        const tgtName = mapTgt.querySelector(`option[value="${tgt}"]`)?.text || tgt;
        li.innerHTML = `<span><b>${srcName}</b> ➡️ <b>${tgtName}</b></span>
                        <button class="btn-danger" style="padding:4px 8px; font-size:11px;" onclick="deleteMap('${src}')">${window.t("btn_del")}</button>`;
        list.appendChild(li);
    }
}
window.deleteMap = function(src) { delete window.appState.m[src]; renderMappingList(); window.saveToURL(); }

document.getElementById('btn-copy-url').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => alert(window.t("msg_url_copied")));
});

function loadControllerSettings() {
    const c = window.appState.c || {};
    document.getElementById('ctrl-bgC').value = c.bgC || '#222222';
    document.getElementById('ctrl-bgC-text').value = c.bgC || '#222222';
    document.getElementById('ctrl-bgI').value = c.bgI || '';
    document.getElementById('ctrl-w').value = c.w || 500;
    document.getElementById('ctrl-h').value = c.h || 300;
}

function updateControllerPreview() {
    const bgC = document.getElementById('ctrl-bgC').value;
    document.getElementById('ctrl-bgC-text').value = bgC;
}

function updateControllerSize() {
    if (!window.appState.c) window.appState.c = {};
    window.appState.c.w = parseInt(document.getElementById('ctrl-w').value) || 500;
    window.appState.c.h = parseInt(document.getElementById('ctrl-h').value) || 300;
    
    const controller = document.getElementById('gamepad-ui');
    if (controller) {
        controller.style.width = window.appState.c.w + 'px';
        controller.style.height = window.appState.c.h + 'px';
    }
}

function applyControllerSettings() {
    if (!window.appState.c) window.appState.c = {};
    window.appState.c.bgC = document.getElementById('ctrl-bgC').value || '#222222';
    window.appState.c.bgI = document.getElementById('ctrl-bgI').value || '';
    window.appState.c.w = parseInt(document.getElementById('ctrl-w').value) || 500;
    window.appState.c.h = parseInt(document.getElementById('ctrl-h').value) || 300;

    window.applyAllCustomizations();
    window.saveToURL();

    const btn = document.getElementById('btn-apply-controller');
    const originalText = btn.innerText;
    btn.innerText = window.t("msg_ctrl_applied");
    btn.style.background = "#3b82f6";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
    }, 1000);
}

document.getElementById('btn-apply-controller').addEventListener('click', applyControllerSettings);

document.getElementById('ctrl-bgC').addEventListener('input', updateControllerPreview);
document.getElementById('ctrl-w').addEventListener('input', updateControllerSize);
document.getElementById('ctrl-h').addEventListener('input', updateControllerSize);

document.getElementById('btn-reset-controller').addEventListener('click', () => {
    window.appState.c = { bgC: '#222222', bgI: '', w: 500, h: 300 };
    loadControllerSettings();
    window.applyAllCustomizations();
    window.saveToURL();
});

document.getElementById('btn-reset-global-design').addEventListener('click', () => {
    if (!confirm(window.t("confirm_glob_reset"))) return;
    window.appState.g = { bgC: '#444444', efC: '#00ff88', txtC: '#888888', txtAC: '#000000', bgI: '', efI: '' };
    window.applyAllCustomizations();
    window.saveToURL();
    loadLayoutIntoInputs();
    alert(window.t("msg_glob_reset"));
});

document.getElementById('btn-apply-design').addEventListener('click', () => {
    window.saveToURL();
    const btn = document.getElementById('btn-apply-design');
    const originalText = btn.innerText;
    btn.innerText = window.t("msg_saved"); btn.style.background = "#3b82f6"; btn.style.color = "#fff";
    setTimeout(() => { btn.innerText = window.t("btn_save"); btn.style.background = ""; btn.style.color = ""; }, 1000);
});
