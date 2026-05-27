let gamepadIndex = null;

window.addEventListener("gamepadconnected", (e) => {
    gamepadIndex = e.gamepad.index;
    document.getElementById('modal-status').innerText = `✅ 연결됨: ${e.gamepad.id}`;
    document.getElementById('gamepad-ui').classList.add('connected');
    requestAnimationFrame(updateLoop);
});

window.addEventListener("gamepaddisconnected", (e) => {
    if (e.gamepad.index === gamepadIndex) {
        gamepadIndex = null; 
        document.getElementById('modal-status').innerText = "❌ 컨트롤러 연결 끊김";
        document.getElementById('gamepad-ui').classList.remove('connected');
    }
});

function updateLoop() {
    if (gamepadIndex === null) return;
    const gp = navigator.getGamepads()[gamepadIndex];
    if (gp) {
        document.querySelectorAll('.btn-wrapper.active, .trigger-container.active, .stick-area.active').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('.trigger-bar').forEach(el => el.style.height = '0%');

        gp.buttons.forEach((button, hardwareIndex) => {
            if (!button.pressed && button.value === 0) return;
            let targetId = window.appState.m[hardwareIndex] !== undefined ? window.appState.m[hardwareIndex] : `btn-${hardwareIndex}`;
            
            if (targetId === 'btn-6') targetId = 'trigger-box-6';
            if (targetId === 'btn-7') targetId = 'trigger-box-7';
            if (targetId === 'btn-10') targetId = 'stick-l'; 
            if (targetId === 'btn-11') targetId = 'stick-r';

            const el = document.getElementById(targetId);
            if (el) {
                if (targetId.includes('trigger')) {
                    const bar = document.getElementById(targetId.replace('box', 'bar'));
                    if (bar) bar.style.height = `${button.value * 100}%`;
                    if (button.value > 0.05) el.classList.add('active');
                } else {
                    el.classList.add('active');
                }
            }
        });

        const moveX_L = gp.axes[0] * 20;
        const moveY_L = gp.axes[1] * 20;
        document.getElementById('stick-l').style.transform = `translate(${moveX_L}px, ${moveY_L}px)`;
        
        const lineL = document.getElementById('stick-line-l');
        if (window.appState.s.showStickLine && (Math.abs(moveX_L) > 0.5 || Math.abs(moveY_L) > 0.5)) {
            lineL.style.display = 'block';
            const distL = 2 * Math.sqrt(moveX_L * moveX_L + moveY_L * moveY_L);
            const angleL = Math.atan2(moveY_L, moveX_L) * (180 / Math.PI);
            lineL.style.width = `${distL}px`;
            lineL.style.transform = `rotate(${angleL}deg)`;
        } else {
            lineL.style.display = 'none';
        }

        const moveX_R = gp.axes[2] * 20;
        const moveY_R = gp.axes[3] * 20;
        document.getElementById('stick-r').style.transform = `translate(${moveX_R}px, ${moveY_R}px)`;
        
        const lineR = document.getElementById('stick-line-r');
        if (window.appState.s.showStickLine && (Math.abs(moveX_R) > 0.5 || Math.abs(moveY_R) > 0.5)) {
            lineR.style.display = 'block';
            const distR = 2 * Math.sqrt(moveX_R * moveX_R + moveY_R * moveY_R);
            const angleR = Math.atan2(moveY_R, moveX_R) * (180 / Math.PI);
            lineR.style.width = `${distR}px`;
            lineR.style.transform = `rotate(${angleR}deg)`;
        } else {
            lineR.style.display = 'none';
        }
    }
    requestAnimationFrame(updateLoop);
}