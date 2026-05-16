// =====================================
// DACBIET.JS
// LUẬT ĐẶC BIỆT CỜ CÁ NGỰA VIỆT NAM
// + PHÁO HOA CHIẾN THẮNG
// =====================================

(function(){

    const wait = setInterval(()=>{

        if(!window.game) return;

        clearInterval(wait);

        initSpecial();

    },200);

    function initSpecial(){

        const oldMove =
            game.handleMove.bind(game);

        const oldGetDestination =
            game.getDestination.bind(game);

        const oldCheckWin =
            game.checkWin.bind(game);

        // =====================================
        // ƯU ÁI ĐƯỜNG VỀ ĐÍCH
        // =====================================

        game.getDestination = function(
            player,
            pos,
            steps
        ){

            // =================================
            // ĐANG Ở Ô 2
            // ĐỔ TỔNG 3
            // => LÊN Ô 3
            // =================================

            if(pos === 2 && steps === 3){

                return 3;
            }

            // =================================
            // ĐANG Ở Ô 3
            // ĐỔ TỔNG 4
            // => LÊN Ô 4
            // =================================

            if(pos === 3 && steps === 4){

                return 4;
            }

            // =================================
            // ĐANG Ở Ô 4
            // ĐỔ TỔNG 5
            // => LÊN Ô 5
            // =================================

            if(pos === 4 && steps === 5){

                return 5;
            }

            return oldGetDestination(
                player,
                pos,
                steps
            );
        };

        // =====================================
        // GIÁM SÁT TOÀN BỘ NƯỚC ĐI
        // =====================================

        game.handleMove = function(el){

            const oldPositions =
                JSON.parse(
                    JSON.stringify(game.positions)
                );

            const player =
                this.players[this.turn];

            const idx =
                parseInt(
                    el.getAttribute('piece')
                );

            const oldPos =
                oldPositions[player][idx];

            // chạy move gốc

            oldMove(el);

            const newPos =
                game.positions[player][idx];

            // không di chuyển

            if(oldPos === newPos) return;

            // tính bước đi thật

            let steps =
                (newPos - oldPos + 52) % 52;

            if(steps <= 0) return;

            // chỉ áp dụng 1 -> 6

            if(
                steps < 1 ||
                steps > 6
            ) return;

            // =================================
            // ĐÁ DÂY CHUYỀN
            // =================================

            const allPlayers =
                ['P1','P2','P3','P4'];

            allPlayers.forEach(enemy=>{

                if(enemy === player) return;

                game.positions[enemy]
                .forEach((enemyPos,eIdx)=>{

                    // bỏ qua quân trong nhà

                    if(enemyPos >= 100) return;

                    // khoảng cách

                    const dist =
                        (enemyPos - oldPos + 52) % 52;

                    // đúng khoảng cách

                    if(dist === steps){

                        // đá quân

                        game.positions[enemy][eIdx] =
                            500 + eIdx;
                    }

                });

            });

            game.updateUI();
        };

        // =====================================
        // =====================================
// PHÁO HOA CHIẾN THẮNG
// =====================================

// =====================================
// PHÁO HOA CHỈ KHI KẾT THÚC THẬT
// =====================================

game.checkWin = function(player){

    // gọi check gốc

    const result =
        oldCheckWin(player);

    // chờ bảng kết quả render

    setTimeout(()=>{

        // =============================
        // KIỂM TRA THẬT SỰ THẮNG
        // =============================

        const finishBoard =

            document.body.innerText
            .includes('HẠNG NHẤT')

            ||

            document.body.innerText
            .includes('Kết Quả');

        // chưa kết thúc thật

        if(!finishBoard){

            return;
        }

        // đã có pháo hoa

        if(
            document.getElementById(
                'fireworks-layer'
            )
        ){

            return;
        }

        // chạy pháo hoa

        startFireworks();

    },1200);

    return result;
};

// =====================================
// BẮT ĐẦU PHÁO HOA
// =====================================

function startFireworks(){

    // tránh tạo nhiều lớp

    if(
        document.getElementById(
            'fireworks-layer'
        )
    ) return;

    const layer =
        document.createElement('div');

    layer.id = 'fireworks-layer';

    layer.style.position = 'fixed';
    layer.style.left = '0';
    layer.style.top = '0';
    layer.style.width = '100%';
    layer.style.height = '100%';

    layer.style.pointerEvents = 'none';

    // CAO HƠN BẢNG KẾT QUẢ

    layer.style.zIndex = '999999';

    document.body.appendChild(layer);

    // =================================
    // BẮN LIÊN TỤC
    // =================================

    const interval = setInterval(()=>{

        for(let i=0;i<8;i++){

            createFirework(layer);
        }

    },300);

    // =================================
    // DỪNG SAU 20 GIÂY
    // =================================

    setTimeout(()=>{

        clearInterval(interval);

        layer.remove();

    },20000);
}

// =====================================
// TẠO PHÁO HOA
// =====================================

function createFirework(layer){

    const fw =
        document.createElement('div');

    fw.style.position = 'absolute';

    const size =
        6 + Math.random()*12;

    fw.style.width =
        size + 'px';

    fw.style.height =
        size + 'px';

    fw.style.borderRadius = '50%';

    fw.style.background =
        randomColor();

    fw.style.left =
        Math.random()*100 + '%';

    fw.style.top =
        Math.random()*100 + '%';

    fw.style.boxShadow =
        `
        0 0 15px white,
        0 0 30px ${randomColor()},
        0 0 60px ${randomColor()}
        `;

    fw.style.animation =
        'fireworkBoom 1.5s ease-out forwards';

    layer.appendChild(fw);

    setTimeout(()=>{

        fw.remove();

    },1500);
}

// =====================================
// RANDOM COLOR
// =====================================

function randomColor(){

    const colors = [

        '#ff0',
        '#ff4444',
        '#00ffff',
        '#00ff00',
        '#ffffff',
        '#ff66ff',
        '#00aaff',
        '#ffaa00',
        '#ff2200'
    ];

    return colors[
        Math.floor(
            Math.random()*colors.length
        )
    ];
}

// =====================================
// CSS PHÁO HOA
// =====================================

const style =
    document.createElement('style');

style.innerHTML = `

@keyframes fireworkBoom{

    0%{

        transform:
        scale(0);

        opacity:1;
    }

    100%{

        transform:
        scale(12);

        opacity:0;
    }
}

`;

document.head.appendChild(style);

console.log(
    'ĐÃ KÍCH HOẠT PHÁO HOA'
);

    }

})();