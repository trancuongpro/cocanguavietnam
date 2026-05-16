// =====================================
// VUIVUI.JS
// ĐẾM NGƯỢC RESET 15 GIÂY (ANH) + ĐỒNG BỘ TIẾNG NGỰA HÍ LÊN CHUỒNG (5->4->3->2)
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

        let count = 15; 

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
        synth.cancel(); 

        const utter =
            new SpeechSynthesisUtterance(
                num.toString()
            );

        utter.lang = 'en-US'; 
        utter.rate = 1.1; 
        utter.pitch = 1.0;
        utter.volume = 1;

        synth.speak(utter);
    }

})();

// =====================================
// ÂM THANH VUI NHỘN TOÀN TRẬN (.MP3)
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

    // Mảng lưu vết thứ tự đã lên đỉnh chuồng thành công của từng màu
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

                // Kiểm tra âm thanh lên chuồng dựa theo vị trí mới
                checkFinishSound(player, newPos);
            });
        });
    }

    // ================================================================
    // LOGIC ĐỒNG BỘ CHUỒNG THEO SCRIPT.JS & ÉP BUỘC THỨ TỰ LÊN 5 -> 4 -> 3 -> 2
    // ================================================================
    function checkFinishSound(player, pos){
        // Đồng bộ chuẩn bản đồ gốc: P1=100, P2=200, P3=300, P4=400
        const homeMap = { P1:100, P2:200, P3:300, P4:400 };
        const base = homeMap[player];

        // Nếu quân cờ không nằm trong chuồng của người chơi đó, bỏ qua
        if(pos < base || pos > base + 4) return;

        // Tính toán chính xác Cấp độ (Level) hiển thị trên bảng cờ (từ 1 đến 5 tương ứng chỉ số 0 đến 4)
        const level = pos - base + 1;
        const progress = finishProgress[player];

        // Điều kiện 1: Lên ô số 5 đầu tiên -> Kích hoạt hí 2 lần
        if(level === 5 && !progress.includes(5)){
            progress.push(5);
            playMany(2);
            return;
        }
        
        // Điều kiện 2: Phải có ô 5 rồi mới được kích hoạt khi lên ô 4
        if(level === 4 && progress.includes(5) && !progress.includes(4)){
            progress.push(4);
            playMany(2);
            return;
        }
        
        // Điều kiện 3: Phải có cả ô 5 và ô 4 rồi mới kích hoạt khi lên ô 3
        if(level === 3 && progress.includes(5) && progress.includes(4) && !progress.includes(3)){
            progress.push(3);
            playMany(2);
            return;
        }
        
        // Điều kiện 4: Phải có đủ 5, 4, 3 rồi mới kích hoạt khi lên ô 2 -> Hí vang dội 3 lần
        if(level === 2 && progress.includes(5) && progress.includes(4) && progress.includes(3) && !progress.includes(2)){
            progress.push(2);
            playMany(3);
            return;
        }
    }
})();