const translations = {
    ko: {
        "page_title": "Controller Skin (설정: C키)",
        "toast_hint": "💡 단축키 'C'를 눌러 설정 및 레이아웃 에디터를 열 수 있습니다.",
        "modal_title": "⚙️ Controller Skin 에디터",
        "status_waiting": "⏳ 패드 연결 대기 중... (아무 버튼이나 누르세요)",
        "status_connected": "✅ 연결됨: ",
        "status_disconnected": "❌ 컨트롤러 연결 끊김",
        
        "tab_layout": "📐 레이아웃",
        "tab_design": "🎨 디자인 (색상/이미지)",
        "tab_controller": "🎮 컨트롤러 바디",
        
        "title_layout": "위치 및 크기 조절",
        "badge_drag": "마우스 드래그 지원 🖐️",
        "btn_add_custom": "➕ 새 버튼",
        "lbl_x": "X (Left px)", "lbl_y": "Y (Top px)", "lbl_w": "너비 (W)", "lbl_h": "높이 (H)",
        "lbl_text": "버튼 텍스트 (옵션)", "ph_text": "예: C, Z, M1", "ph_text_disabled": "텍스트 변경 불가",
        "lbl_radius": "테두리 둥글기 (Border Radius px)", "ph_radius": "50 = 원형, 5 = 네모",
        
        "btn_del_layout": "레이아웃/버튼 삭제",
        "btn_reset_custom": "이 버튼 완전 삭제",
        "btn_reset_base": "기본 위치로 초기화",
        "btn_save": "💾 설정 저장",
        "msg_saved": "✔️ 저장 완료!",
        
        "title_design": "색상 및 이미지 설정",
        "lbl_bg_c": "평상시 색상", "lbl_ef_c": "효과 색상",
        "lbl_txt_c": "텍스트 색상", "lbl_txt_ac": "효과 텍스트",
        "lbl_alpha": "불투명도 ",
        "summary_img": "🖼️ 이미지 URL 설정",
        "lbl_bg_img": "평상시 이미지 URL", "ph_bg_img": "https://... (imgur 등의 짧은 주소 권장)",
        "lbl_ef_img": "활성화 효과 이미지 URL", "ph_ef_img": "https://... (배경이 투명한 PNG 권장)",
        "warn_url": "⚠️ 구글 검색 등에서 복사한 엄청나게 긴 URL(Data URI 등)을 넣으면 데이터 제한 초과로 저장이 실패할 수 있습니다. 가급적 Imgur 등에 업로드한 짧은 주소를 사용하세요.",
        
        "btn_reset_indiv": "↺ 개별 설정 초기화",
        "btn_apply_glob": "🌍 선택된 디자인을 글로벌 테마로",
        "btn_reset_glob": "🌍 글로벌 테마 초기화",
        "msg_glob_applied": "현재 지정한 색상/이미지가 모든 버튼의 기본 테마로 덮어씌워졌습니다!",
        "confirm_glob_reset": "글로벌 테마를 기본값으로 초기화합니다. 계속하시겠습니까?",
        "msg_glob_reset": "글로벌 테마가 기본값으로 초기화되었습니다.",
        
        "title_ctrl": "컨트롤러 바디 커스터마이징",
        "lbl_ctrl_bg": "배경 색상", "lbl_ctrl_preview": "배경 색상 (Hex)",
        "lbl_ctrl_img": "배경 이미지 URL", "ph_ctrl_img": "https://... (배경이 투명하거나 불투명한 이미지)",
        "btn_ctrl_reset": "↺ 컨트롤러 바디 초기화",
        "btn_ctrl_apply": "✅ 컨트롤러 바디 적용",
        "msg_ctrl_applied": "✔️ 적용 완료!",
        
        "title_map": "하드웨어 입력 매핑",
        "btn_add": "추가", "btn_del": "삭제",
        "opt_base": "[기본]", "opt_custom": "[커스텀]", "opt_visual": "[시각화]", "opt_input": "[입력]",
        
        "lbl_stick_line": " 스틱 방향 지시선 표시",
        "btn_copy_url": "🔗 URL 복사 (OBS용)", "btn_close": "닫기 (C)",
        "msg_url_copied": "설정이 포함된 URL이 복사되었습니다!",
        "msg_url_error": "저장 실패! 이미지 URL이 너무 길어 주소창 용량을 초과했습니다. 짧은 URL로 변경해주세요.",
        
        "b_a": "A 버튼", "b_b": "B 버튼", "b_x": "X 버튼", "b_y": "Y 버튼",
        "b_lb": "LB", "b_rb": "RB", "b_lt": "LT", "b_rt": "RT",
        "b_lb_f": "LB (좌측 범퍼)", "b_rb_f": "RB (우측 범퍼)", "b_lt_f": "LT (좌측 트리거)", "b_rt_f": "RT (우측 트리거)",
        "b_sel": "Select / Back", "b_str": "Start / Menu", "b_home": "Home / Guide", "b_cap": "Capture / Share",
        "b_l3": "LS (좌스틱 클릭)", "b_r3": "RS (우스틱 클릭)",
        "b_up": "십자 상", "b_dn": "십자 하", "b_l": "십자 좌", "b_r": "십자 우",
        "b_extra": "추가 신호"
    },
    en: {
        "page_title": "Controller Skin (Settings: C)",
        "toast_hint": "💡 Press 'C' to open settings and layout editor.",
        "modal_title": "⚙️ Controller Skin Editor",
        "status_waiting": "⏳ Waiting for gamepad... (Press any button)",
        "status_connected": "✅ Connected: ",
        "status_disconnected": "❌ Controller Disconnected",
        
        "tab_layout": "📐 Layout",
        "tab_design": "🎨 Design",
        "tab_controller": "🎮 Controller Body",
        
        "title_layout": "Position & Size",
        "badge_drag": "Drag & Drop Supported 🖐️",
        "btn_add_custom": "➕ Add Custom",
        "lbl_x": "X (Left px)", "lbl_y": "Y (Top px)", "lbl_w": "Width (W)", "lbl_h": "Height (H)",
        "lbl_text": "Button Text (Opt)", "ph_text": "e.g., C, Z, M1", "ph_text_disabled": "Text unchangeable",
        "lbl_radius": "Border Radius (px)", "ph_radius": "50 = Circle, 5 = Square",
        
        "btn_del_layout": "Delete Layout/Button",
        "btn_reset_custom": "Delete Custom Button",
        "btn_reset_base": "↺ Reset to Default",
        "btn_save": "💾 Save",
        "msg_saved": "✔️ Saved!",
        
        "title_design": "Colors & Images",
        "lbl_bg_c": "Base Color", "lbl_ef_c": "Effect Color",
        "lbl_txt_c": "Text Color", "lbl_txt_ac": "Active Text",
        "lbl_alpha": "Opacity ",
        "summary_img": "🖼️ Image URLs",
        "lbl_bg_img": "Base Image URL", "ph_bg_img": "https://... (Short URLs recommended)",
        "lbl_ef_img": "Active Effect Image URL", "ph_ef_img": "https://... (Transparent PNG recommended)",
        "warn_url": "⚠️ Using excessively long URLs (like Base64 Data URIs) may exceed URL limits. Please use short image host links.",
        
        "btn_reset_indiv": "↺ Reset to Default",
        "btn_apply_glob": "🌍 Current to Global Theme",
        "btn_reset_glob": "🌍 Reset Global Theme",
        "msg_glob_applied": "Current design has been applied as the global theme!",
        "confirm_glob_reset": "Reset global theme to default? Are you sure?",
        "msg_glob_reset": "Global theme has been reset to defaults.",
        
        "title_ctrl": "Controller Body Configuration",
        "lbl_ctrl_bg": "Background Color", "lbl_ctrl_preview": "Hex Color Code",
        "lbl_ctrl_img": "Background Image URL", "ph_ctrl_img": "https://... (Transparent or opaque image)",
        "btn_ctrl_reset": "↺ Reset to Default",
        "btn_ctrl_apply": "✅ Apply Body",
        "msg_ctrl_applied": "✔️ Applied!",
        
        "title_map": "Hardware Input Mapping",
        "btn_add": "Add", "btn_del": "Delete",
        "opt_base": "[Base]", "opt_custom": "[Custom]", "opt_visual": "[Visual]", "opt_input": "[Input]",
        
        "lbl_stick_line": " Show Stick Direction Line",
        "btn_copy_url": "🔗 Copy URL (for OBS)", "btn_close": "Close (C)",
        "msg_url_copied": "Settings URL copied to clipboard!",
        "msg_url_error": "Save failed! The URL is too long. Please use shorter links.",
        
        "b_a": "A", "b_b": "B", "b_x": "X", "b_y": "Y",
        "b_lb": "LB", "b_rb": "RB", "b_lt": "LT", "b_rt": "RT",
        "b_lb_f": "LB (Left Bumper)", "b_rb_f": "RB (Right Bumper)", "b_lt_f": "LT (Left Trigger)", "b_rt_f": "RT (Right Trigger)",
        "b_sel": "Select / Back", "b_str": "Start / Menu", "b_home": "Home / Guide", "b_cap": "Capture / Share",
        "b_l3": "LS (Left Stick Click)", "b_r3": "RS (Right Stick Click)",
        "b_up": "D-Pad Up", "b_dn": "D-Pad Down", "b_l": "D-Pad Left", "b_r": "D-Pad Right",
        "b_extra": "Extra Signal"
    }
};

// 언어 파라미터 확인 (기본값 ko)
const urlParams = new URLSearchParams(window.location.search);
window.currentLang = urlParams.get('lang') || 'ko';
if (!translations[window.currentLang]) window.currentLang = 'ko';

// 번역 반환 함수
window.t = function(key) {
    return translations[window.currentLang][key] || key;
};

// DOM 전체 언어 적용 함수
window.applyTranslations = function() {
    document.title = window.t('page_title');
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = window.t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        el.placeholder = window.t(key);
    });
};