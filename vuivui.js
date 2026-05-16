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