// =====================================
// VUIVUI.JS
// GIỌNG ĐỌC KẾT QUẢ + ĐẾM NGƯỢC RESET
// =====================================

(function(){

    // =================================
    // CHỜ BẢNG KẾT QUẢ XUẤT HIỆN
    // =================================

    const waitBoard = setInterval(()=>{

        const board =
            document.getElementById(
                'bang-ketqua'
            );

        if(!board) return;

        clearInterval(waitBoard);

        startVoiceSystem(board);

    },500);

    // =================================
    // HỆ THỐNG GIỌNG ĐỌC
    // =================================

    function startVoiceSystem(board){

        // tránh đọc nhiều lần

        if(window.__voicePlayed) return;

        window.__voicePlayed = true;

        // =================================
        // LẤY TOÀN BỘ TEXT
        // =================================

        let text =
            board.innerText;

        // bỏ chữ button

        text =
            text.replace(
                '🔄 Reset Chơi Lại',
                ''
            );

        // =================================
        // THÊM CÂU KẾT
        // =================================

        text +=
            '. Chúng tôi sẽ đếm ngược và reset trận đấu lại từ đầu.';

        // =================================
        // GIỌNG ĐỌC
        // =================================

        speakVietnamese(
            text,
            ()=>{

                startCountdown();

            }
        );
    }

    // =================================
    // HÀM ĐỌC TIẾNG VIỆT
    // =================================

    function speakVietnamese(
        text,
        callback
    ){

        const synth =
            window.speechSynthesis;

        const utter =
            new SpeechSynthesisUtterance(
                text
            );

        utter.lang = 'vi-VN';

        utter.rate = 1;

        utter.pitch = 1.1;

        utter.volume = 1;

        // =================================
        // CHỌN GIỌNG NỮ
        // =================================

        const voices =
            synth.getVoices();

        const femaleVoice =
            voices.find(v=>

                v.lang.includes('vi')

                &&

                (
                    v.name
                    .toLowerCase()
                    .includes('female')

                    ||

                    v.name
                    .toLowerCase()
                    .includes(' nữ')

                    ||

                    v.name
                    .toLowerCase()
                    .includes('google')
                )
            );

        if(femaleVoice){

            utter.voice =
                femaleVoice;
        }

        utter.onend = ()=>{

            if(callback){

                callback();
            }
        };

        synth.speak(utter);
    }

    // =================================
    // ĐẾM NGƯỢC RESET
    // =================================

    function startCountdown(){

        let count = 10;

        // =================================
        // BẢNG ĐẾM NGƯỢC
        // =================================

        const box =
            document.createElement('div');

        box.id = 'countdown-reset';

        box.style.position = 'fixed';
        box.style.left = '50%';
        box.style.bottom = '30px';

        box.style.transform =
            'translateX(-50%)';

        box.style.background =
            'rgba(0,0,0,0.85)';

        box.style.border =
            '3px solid gold';

        box.style.borderRadius =
            '14px';

        box.style.padding =
            '18px 30px';

        box.style.color =
            'white';

        box.style.fontSize =
            '34px';

        box.style.fontWeight =
            'bold';

        box.style.zIndex =
            '9999999';

        box.style.textAlign =
            'center';

        box.style.boxShadow =
            '0 0 20px gold';

        document.body.appendChild(box);

        updateText();

        // =================================
        // GIỌNG ĐỌC ĐẾM NGƯỢC
        // =================================

        speakNumber(count);

        const interval =
            setInterval(()=>{

                count--;

                if(count <= 0){

                    clearInterval(interval);

                    box.innerHTML =
                        '🔄 RESET GAME';

                    speakVietnamese(
                        'Reset trận đấu',
                        ()=>{

                                window.location.href =
                                        window.location.pathname;

                        }
                    );

                    return;
                }

                updateText();

                speakNumber(count);

            },1000);

        // =================================
        // UPDATE TEXT
        // =================================

        function updateText(){

            box.innerHTML =

                `
                ⏳ RESET SAU
                <br>
                ${count}
                `;
        }
    }

    // =================================
    // ĐỌC SỐ
    // =================================

    function speakNumber(num){

        const utter =
            new SpeechSynthesisUtterance(
                num.toString()
            );

        utter.lang = 'vi-VN';

        utter.rate = 1;

        utter.pitch = 1.2;

        speechSynthesis.speak(utter);
    }

})();

// =====================================
// ÂM THANH VUI NHỘN TOÀN TRẬN
// =====================================

(function(){

    // =================================
    // LOAD AUDIO
    // =================================

    const kickSounds = [

        new Audio('chetmayroi.mp3'),
        new Audio('troioi.mp3'),
        new Audio('uagido.mp3')

    ];

    const nguaHi =
        new Audio('nguahi.mp3');

    // =================================
    // CHỐNG CHỒNG ÂM
    // =================================

    kickSounds.forEach(a=>{

        a.preload = 'auto';

    });

    nguaHi.preload = 'auto';

    // =================================
    // LƯU TIẾN ĐỘ 5 4 3 2
    // =================================

    const finishProgress = {

        P1:[],
        P2:[],
        P3:[],
        P4:[]
    };

    // =================================
    // KIỂM TRA LOA NHẠC NỀN
    // =================================

    function soundEnabled(){

    // =============================
    // NHẠC NỀN CHÍNH
    // =============================

    const bgm =
        document.getElementById(
            'bg-music'
        );

    // không có thì cho phát

    if(!bgm){

        return true;
    }

    // =============================
    // NẾU NHẠC NỀN TẮT
    // THÌ TOÀN BỘ IM
    // =============================

    if(bgm.paused){

        return false;
    }

    if(bgm.muted){

        return false;
    }

    if(bgm.volume <= 0){

        return false;
    }

    return true;
}

    // =================================
    // PHÁT ÂM THANH
    // =================================

    function playAudio(audio){

        if(!soundEnabled()) return;

        try{

            audio.currentTime = 0;

            audio.play();

        }catch(e){}
    }

    // =================================
    // PHÁT NHIỀU LẦN
    // =================================

    function playMany(times){

        if(!soundEnabled()) return;

        let delay = 0;

        for(let i=0;i<times;i++){

            setTimeout(()=>{

                const a =
                    new Audio('nguahi.mp3');

                a.play();

            },delay);

            delay += 450;
        }
    }

    // =================================
    // CHỜ GAME
    // =================================

    const waitGame = setInterval(()=>{

        if(!window.game) return;

        clearInterval(waitGame);

        hookGame();

    },300);

    // =================================
    // GẮN HỆ THỐNG
    // =================================

    function hookGame(){

        const oldUpdate =
            game.updateUI.bind(game);

        let oldState =
            JSON.stringify(
                game.positions
            );

        game.updateUI = function(){

            const before =
                JSON.parse(oldState);

            oldUpdate();

            const after =
                game.positions;

            checkEvents(
                before,
                after
            );

            oldState =
                JSON.stringify(after);
        };
    }

    // =================================
    // KIỂM TRA EVENT
    // =================================

    function checkEvents(
        before,
        after
    ){

        const players =
            ['P1','P2','P3','P4'];

        players.forEach(player=>{

            after[player]
            .forEach((newPos,idx)=>{

                const oldPos =
                    before[player][idx];

                // =========================
                // QUÂN BỊ ĐÁ
                // =========================

                if(

                    oldPos < 100

                    &&

                    newPos >= 500

                ){

                    const rnd =
                        kickSounds[
                            Math.floor(
                                Math.random()*kickSounds.length
                            )
                        ];

                    playAudio(rnd);
                }

                // =========================
                // XUẤT QUÂN
                // =========================

                if(

                    oldPos >= 500

                    &&

                    newPos < 52

                ){

                    playAudio(
                        new Audio('nguahi.mp3')
                    );
                }

                // =========================
                // THEO DÕI 5 4 3 2
                // =========================

                checkFinishSound(
                    player,
                    newPos
                );

            });

        });
    }

    // =================================
    // ÂM THANH 5 4 3 2
    // =================================

    function checkFinishSound(
        player,
        pos
    ){

        // HOME BASE

        const homeMap = {

            P1:100,
            P2:110,
            P3:120,
            P4:130
        };

        const base =
            homeMap[player];

        // không ở chuồng đích

        if(
            pos < base
            ||
            pos > base+4
        ){
            return;
        }

        // level thực

        const level =
            pos - base + 1;

        const progress =
            finishProgress[player];

        // =================================
        // ĐÚNG THỨ TỰ
        // =================================

        // lên 5

        if(
            level === 5
            &&
            !progress.includes(5)
        ){

            progress.push(5);

            playMany(2);

            return;
        }

        // lên 4

        if(
            level === 4
            &&
            progress.includes(5)
            &&
            !progress.includes(4)
        ){

            progress.push(4);

            playMany(2);

            return;
        }

        // lên 3

        if(
            level === 3
            &&
            progress.includes(5)
            &&
            progress.includes(4)
            &&
            !progress.includes(3)
        ){

            progress.push(3);

            playMany(2);

            return;
        }

        // lên 2 chiến thắng

        if(
            level === 2
            &&
            progress.includes(5)
            &&
            progress.includes(4)
            &&
            progress.includes(3)
            &&
            !progress.includes(2)
        ){

            progress.push(2);

            playMany(3);

            return;
        }
    }

})();