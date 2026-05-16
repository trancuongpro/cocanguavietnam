// =====================================
// VUIVUI.JS
// ÂM THANH + PHÁO HOA KẾT THÚC TRẬN
// (CHẠY ĐƯỢC TRÊN FILE:// - KHÔNG DÙNG FETCH)
// =====================================

(function(){
    const synth = window.speechSynthesis;
    let isSpeechUnlocked = false;

    function unlockSpeechOnSystem() {
        if (isSpeechUnlocked) return;
        synth.cancel();
        const utterBlank = new SpeechSynthesisUtterance(' ');
        utterBlank.volume = 0;
        synth.speak(utterBlank);
        isSpeechUnlocked = true;
        document.removeEventListener('click', unlockSpeechOnSystem);
        document.removeEventListener('touchstart', unlockSpeechOnSystem);
        console.log('AUDIO SYSTEM UNLOCKED');
    }

    document.addEventListener('click', unlockSpeechOnSystem);
    document.addEventListener('touchstart', unlockSpeechOnSystem);

    // ========== ÂM THANH (DÙNG TRỰC TIẾP, KHÔNG FETCH) ==========
    const kickSounds = [
        new Audio('chetmayroi.mp3'),
        new Audio('troioi.mp3'),
        new Audio('uagido.mp3')
    ];
    const diChuyenSound = new Audio('dichuyen.mp3');
    const lenNguaSound = new Audio('lenngua.mp3');
    const xuatQuanSound = new Audio('nguahi.mp3');

    kickSounds.forEach(a => { a.preload = 'auto'; });
    diChuyenSound.preload = 'auto';
    lenNguaSound.preload = 'auto';
    xuatQuanSound.preload = 'auto';

    // ========== MAP SÂN NHÀ (HOME_YARD) VÀ VỊ TRÍ XUẤT QUÂN (START_POS) ==========
    // Dựa theo script.js
    const HOME_YARD_MAP = {
        P1: [500, 501, 502, 503],
        P2: [600, 601, 602, 603],
        P3: [700, 701, 702, 703],
        P4: [800, 801, 802, 803]
    };
    
    const START_POS_MAP = {
        P1: 0,
        P2: 13,
        P3: 26,
        P4: 39
    };

    function soundEnabled() {
        const bgm = document.getElementById('bg-music');
        if (!bgm) return true;
        if (bgm.paused) return false;
        if (bgm.muted) return false;
        if (bgm.volume <= 0) return false;
        return true;
    }

    function playAudio(audio) {
        if (!soundEnabled()) return;
        try {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio error:', e));
        } catch (e) {}
    }

    // Mảng lưu thứ tự lên chuồng thành công (để bắt buộc 5->4->3->2)
    const finishProgress = {
        P1: [], P2: [], P3: [], P4: []
    };

    // Hàm phát lenngua.mp3 (1 lần khi lên chuồng)
    function playLenNgua() {
        if (!soundEnabled()) return;
        try {
            lenNguaSound.currentTime = 0;
            lenNguaSound.play().catch(e => console.log('Len ngua error:', e));
        } catch (e) {}
    }

    // Hàm phát nguahi.mp3 (khi xuất quân)
    function playXuatQuan() {
        if (!soundEnabled()) return;
        try {
            xuatQuanSound.currentTime = 0;
            xuatQuanSound.play().catch(e => console.log('Xuat quan error:', e));
        } catch (e) {}
    }

    // ========== PHÁO HOA KHI KẾT THÚC TRẬN (BẢN ĐẸP) ==========
    function startFireworks() {
        if (typeof confetti !== 'function') {
            console.log('Thêm thư viện canvas-confetti để có pháo hoa đẹp');
            return;
        }

        // Pháo hoa kéo dài 6 giây
        const duration = 6000;
        const end = Date.now() + duration;

        // Màu sắc rực rỡ hơn
        const colors = [
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
            '#ff00ff', '#00ffff', '#ff8800', '#ff44cc', '#ffffff'
        ];

        (function frame() {
            // Pháo hoa bên trái
            confetti({
                particleCount: 8,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.6 },
                colors: colors,
                startVelocity: 25,
                decay: 0.9,
                ticks: 200
            });
            
            // Pháo hoa bên phải
            confetti({
                particleCount: 8,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.6 },
                colors: colors,
                startVelocity: 25,
                decay: 0.9,
                ticks: 200
            });
            
            // Pháo hoa từ trên xuống (trung tâm)
            confetti({
                particleCount: 5,
                angle: 90,
                spread: 55,
                origin: { x: 0.5, y: 0.2 },
                colors: colors,
                startVelocity: 18,
                decay: 0.9
            });
            
            // Pháo hoa bung lớn giữa sân (ngẫu nhiên)
            if (Math.random() > 0.6) {
                confetti({
                    particleCount: 30,
                    spread: 100,
                    origin: { x: 0.5, y: 0.5 },
                    colors: colors,
                    startVelocity: 15,
                    decay: 0.92,
                    ticks: 150
                });
            }

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }

    // ========== THEO DÕI KẾT THÚC TRẬN ==========
    const waitForResultBoard = setInterval(() => {
        const board = document.getElementById('bang-ketqua');
        if (board) {
            clearInterval(waitForResultBoard);
            startFireworks();
        }
    }, 500);

    // ========== GÁN SỰ KIỆN VÀO GAME ==========
    const waitGame = setInterval(() => {
        if (!window.game) return;
        clearInterval(waitGame);
        hookGame();
    }, 300);

    function hookGame() {
        const oldUpdate = window.game.updateUI.bind(window.game);
        let oldState = JSON.stringify(window.game.positions);

        window.game.updateUI = function() {
            const before = JSON.parse(oldState);
            oldUpdate();
            const after = window.game.positions;
            checkEvents(before, after);
            oldState = JSON.stringify(after);
        };
    }

    function checkEvents(before, after) {
        const players = ['P1', 'P2', 'P3', 'P4'];

        players.forEach(player => {
            after[player].forEach((newPos, idx) => {
                const oldPos = before[player][idx];

                // Phát âm thanh di chuyển khi quân cờ đổi vị trí
                if (oldPos !== newPos) {
                    playAudio(diChuyenSound);
                }

                // ========== XUẤT QUÂN (ÁP DỤNG CHO CẢ 4 MÀU) ==========
                // Kiểm tra: quân từ sân nhà của player đó ra đúng vị trí START_POS
                const homeYard = HOME_YARD_MAP[player];
                const startPos = START_POS_MAP[player];
                
                if (homeYard.includes(oldPos) && newPos === startPos) {
                    playXuatQuan();
                }

                // ========== BỊ ĐÁ (RANDOM 3 ÂM THANH) ==========
                // Bị đá: từ dưới 100 (trên bàn) bay về sân nhà (>=500)
                if (oldPos < 100 && newPos >= 500) {
                    const rnd = kickSounds[Math.floor(Math.random() * kickSounds.length)];
                    playAudio(rnd);
                }

                // Kiểm tra lên chuồng theo thứ tự 5 -> 4 -> 3 -> 2
                checkFinishSound(player, newPos);
            });
        });
    }

    function checkFinishSound(player, pos) {
        const homeMap = { P1: 100, P2: 200, P3: 300, P4: 400 };
        const base = homeMap[player];
        if (!base) return;

        // Chỉ xét khi quân cờ nằm trong khu vực chuồng (100-104, 200-204...)
        if (pos < base || pos > base + 4) return;

        const level = pos - base + 1; // 1,2,3,4,5
        const progress = finishProgress[player];

        // Lên ô 5 đầu tiên
        if (level === 5 && !progress.includes(5)) {
            progress.push(5);
            playLenNgua();
            return;
        }
        // Lên ô 4 (phải có 5)
        if (level === 4 && progress.includes(5) && !progress.includes(4)) {
            progress.push(4);
            playLenNgua();
            return;
        }
        // Lên ô 3 (phải có 5,4)
        if (level === 3 && progress.includes(5) && progress.includes(4) && !progress.includes(3)) {
            progress.push(3);
            playLenNgua();
            return;
        }
        // Lên ô 2 (phải có 5,4,3)
        if (level === 2 && progress.includes(5) && progress.includes(4) && progress.includes(3) && !progress.includes(2)) {
            progress.push(2);
            playLenNgua();
            return;
        }
    }
})();