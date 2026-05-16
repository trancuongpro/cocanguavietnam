// =====================================
// VUIVUI.JS
// ĐẾM NGƯỢC RESET 15 GIÂY - GIỌNG TIẾNG ANH SIÊU TỐI GIẢN & ỔN ĐỊNH
// =====================================

(function(){

    const synth = window.speechSynthesis;
    let isSpeechUnlocked = false;

    // =================================
    // CƠ CHẾ MỞ KHÓA AUDIO CHO TRÌNH DUYỆT (CHROME PC / SAFARI IOS)
    // =================================
    function unlockSpeechOnSystem() {
        if (isSpeechUnlocked) return;
        
        synth.cancel(); // Dọn dẹp hàng đợi hệ thống

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

    // =================================
    // CHỜ BẢNG KẾT QUẢ XUẤT HIỆN ĐỂ KÍCH HOẠT ĐẾM NGƯỢC
    // =================================

    const waitBoard = setInterval(()=>{

        const board =
            document.getElementById(
                'bang-ketqua'
            );

        if(!board) return;

        clearInterval(waitBoard);

        startCountdownSystem();

    },500);

    // =================================
    // BẮT ĐẦU ĐẾM NGƯỢC 15 GIÂY
    // =================================

    function startCountdownSystem(){
        if(window.__countdownStarted) return;
        window.__countdownStarted = true;

        let count = 15; // Nâng thời gian đếm ngược lên 15 giây theo yêu cầu

        // Tạo hộp giao diện hiển thị số giây đếm ngược ngoài màn hình
        const box =
            document.createElement('div');

        box.id = 'countdown-reset';

        box.style.position = 'fixed';
        box.style.left = '50%';
        box.style.bottom = '30px';
        box.style.transform = 'translateX(-50%)';
        box.style.background = 'rgba(0,0,0,0.85)';
        box.style.border = '3px solid gold';
        box.style.borderRadius = '14px';
        box.style.padding = '18px 30px';
        box.style.color = 'white';
        box.style.fontSize = '34px';
        box.style.fontWeight = 'bold';
        box.style.zIndex = '9999999';
        box.style.textAlign = 'center';
        box.style.boxShadow = '0 0 20px gold';

        document.body.appendChild(box);

        updateText();
        speakEnglishNumber(count);

        const interval =
            setInterval(()=>{

                count--;

                if(count <= 0){

                    clearInterval(interval);

                    box.innerHTML = '🔄 RESET GAME';

                    // Khi về 0, lập tức reload lại trang để chơi trận mới từ đầu
                    setTimeout(() => {
                        window.location.href = window.location.pathname;
                    }, 300);

                    return;
                }

                updateText();
                speakEnglishNumber(count);

            },1000);

        function updateText(){
            box.innerHTML =
                `
                ⏳ RESET AFTER
                <br>
                ${count}
                `;
        }
    }

    // =================================
    // HÀM ĐỌC SỐ TIẾNG ANH MẶC ĐỊNH SIÊU NHẸ
    // =================================

    function speakEnglishNumber(num){
        synth.cancel(); // Xóa lệnh cũ, ép phát âm số mới ngay lập tức

        const utter =
            new SpeechSynthesisUtterance(
                num.toString()
            );

        // Sử dụng mã ngôn ngữ tiếng Anh chuẩn Mỹ (luôn có sẵn trên Chrome PC)
        utter.lang = 'en-US'; 
        utter.rate = 1.1; // Tốc độ đọc nhanh hơn một chút cho dứt khoát
        utter.pitch = 1.0;
        utter.volume = 1;

        synth.speak(utter);
    }

})();

// =====================================
// ÂM THANH VUI NHỘN TOÀN TRẬN (.MP3 KHÔNG ĐỔI)
// =====================================
(function(){

    const kickSounds = [
        new Audio('chetmayroi.mp3'),
        new Audio('troioi.mp3'),
        new Audio('uagido.mp3')
    ];

    const nguaHi = new Audio('nguahi.mp3');

    kickSounds.forEach(a=>{ a.preload = 'auto'; });
    nguaHi.preload = 'auto';

    const finishProgress = {
        P1:[], P2:[], P3:[], P4:[]
    };

    function soundEnabled(){
        const bgm = document.getElementById('bg-music');
        if(!bgm) return true;
        if(bgm.paused) return false;
        if(bgm.muted) return false;
        if(bgm.volume <= 0) return false;
        return true;
    }

    function playAudio(audio){
        if(!soundEnabled()) return;
        try{
            audio.currentTime = 0;
            audio.play();
        }catch(e){}
    }

    function playMany(times){
        if(!soundEnabled()) return;
        let current = 0;

        function playNext(){
            if(current >= times) return;

            const a = new Audio('nguahi.mp3');
            a.volume = 1;
            
            a.play().catch(()=>{});

            current++;
            a.onended = ()=>{
                setTimeout(()=>{
                    playNext();
                },120);
            };
        }
        playNext();
    }

    const waitGame = setInterval(()=>{
        if(!window.game) return;
        clearInterval(waitGame);
        hookGame();
    },300);

    function hookGame(){
        const oldUpdate = game.updateUI.bind(game);
        let oldState = JSON.stringify(game.positions);

        game.updateUI = function(){
            const before = JSON.parse(oldState);
            oldUpdate();
            const after = game.positions;
            checkEvents(before, after);
            oldState = JSON.stringify(after);
        };
    }

    function checkEvents(before, after){
        const players = ['P1','P2','P3','P4'];

        players.forEach(player=>{
            after[player]
            .forEach((newPos,idx)=>{
                const oldPos = before[player][idx];

                if(oldPos < 100 && newPos >= 500){
                    const rnd = kickSounds[Math.floor(Math.random()*kickSounds.length)];
                    playAudio(rnd);
                }

                if(oldPos >= 500 && newPos < 52){
                    playAudio(new Audio('nguahi.mp3'));
                }

                checkFinishSound(player, newPos);
            });
        });
    }

    function checkFinishSound(player, pos){
        const homeMap = { P1:100, P2:110, P3:120, P4:130 };
        const base = homeMap[player];

        if(pos < base || pos > base+4) return;

        const level = pos - base + 1;
        const progress = finishProgress[player];

        if(level === 5 && !progress.includes(5)){
            progress.push(5);
            playMany(2);
            return;
        }
        if(level === 4 && progress.includes(5) && !progress.includes(4)){
            progress.push(4);
            playMany(2);
            return;
        }
        if(level === 3 && progress.includes(5) && progress.includes(4) && !progress.includes(3)){
            progress.push(3);
            playMany(2);
            return;
        }
        if(level === 2 && progress.includes(5) && progress.includes(4) && progress.includes(3) && !progress.includes(2)){
            progress.push(2);
            playMany(3);
            return;
        }
    }
})();