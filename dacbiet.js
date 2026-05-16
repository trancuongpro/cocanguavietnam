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
            // LUẬT ƯU ÁI 5 - 4 - 3 - 2
            // CHUỒNG THẮNG
            // =================================

            // Ô 2 -> Ô 3
            if(
                pos === HOME_BASE[player] + 1 &&
                steps === 3
            ){
                return HOME_BASE[player] + 2;
            }

            // Ô 3 -> Ô 4
            if(
                pos === HOME_BASE[player] + 2 &&
                steps === 4
            ){
                return HOME_BASE[player] + 3;
            }

            // Ô 4 -> Ô 5
            if(
                pos === HOME_BASE[player] + 3 &&
                steps === 5
            ){
                return HOME_BASE[player] + 4;
            }

            // Nếu không rơi vào luật ưu ái, chạy logic gốc
            return oldGetDestination(player, pos, steps);
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
        // PHÁO HOA CHIẾN THẮNG KIỂU THẬT
        // =====================================

        game.checkWin = function(player){

            const result =
                oldCheckWin(player);

            setTimeout(()=>{

                const finishBoard =
                    document.body.innerText
                    .includes('HẠNG NHẤT')
                    ||
                    document.body.innerText
                    .includes('Kết Quả');

                if(!finishBoard) return;

                if(
                    document.getElementById(
                        'fireworks-layer'
                    )
                ){
                    return;
                }

                startFireworks();

            },1200);

            return result;
        };

        // =====================================
        // START FIREWORKS
        // =====================================

        function startFireworks(){

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
            layer.style.zIndex = '999999';
            layer.style.overflow = 'hidden';

            document.body.appendChild(layer);

            // bắn liên tục
            const interval = setInterval(()=>{

                launchFirework(layer);

            },350);

            // dừng sau 20 giây
            setTimeout(()=>{

                clearInterval(interval);

                layer.remove();

            },20000);
        }

        // =====================================
        // PHÁO HOA BAY LÊN
        // =====================================

        function launchFirework(layer){

            const rocket =
                document.createElement('div');

            rocket.style.position = 'absolute';

            const startX =
                10 + Math.random()*80;

            rocket.style.left =
                startX + '%';

            rocket.style.bottom = '-20px';

            rocket.style.width = '4px';
            rocket.style.height = '18px';

            rocket.style.borderRadius = '10px';

            rocket.style.background = 'white';

            rocket.style.boxShadow =
                `
                0 0 10px white,
                0 0 20px cyan
                `;

            layer.appendChild(rocket);

            // độ cao ngẫu nhiên
            const boomHeight =
                25 + Math.random()*40;

            // Thời gian bay ngẫu nhiên từ thời điểm tạo cho đến khi nổ
            const durationTime = 900 + Math.random()*500;

            rocket.animate([
                {
                    transform: 'translateY(0)',
                    opacity: 1
                },
                {
                    transform: `translateY(-${window.innerHeight * (boomHeight/100)}px)`,
                    opacity: 1
                }
            ],{
                duration: durationTime,
                easing: 'ease-out',
                fill: 'forwards'
            });

            // nổ pháo dựa theo thời gian bay thực tế của animation
            setTimeout(()=>{

                const rect =
                    rocket.getBoundingClientRect();

                createExplosion(
                    layer,
                    rect.left,
                    rect.top
                );

                rocket.remove();

            }, durationTime);
        }

        // =====================================
        // TẠO VỤ NỔ
        // =====================================

        function createExplosion(
            layer,
            x,
            y
        ){

            const particleCount =
                40 + Math.random()*30;

            for(let i=0;i<particleCount;i++){

                const p =
                    document.createElement('div');

                p.style.position = 'absolute';

                p.style.left = x + 'px';
                p.style.top = y + 'px';

                const size =
                    3 + Math.random()*4;

                p.style.width =
                    size + 'px';

                p.style.height =
                    size + 'px';

                p.style.borderRadius = '50%';

                const color =
                    randomColor();

                p.style.background =
                    color;

                p.style.boxShadow =
                    `
                    0 0 6px white,
                    0 0 12px ${color},
                    0 0 25px ${color}
                    `;

                layer.appendChild(p);

                // góc bắn
                const angle =
                    Math.random() * Math.PI * 2;

                // khoảng cách
                const distance =
                    80 + Math.random()*180;

                const dx =
                    Math.cos(angle) * distance;

                const dy =
                    Math.sin(angle) * distance;

                p.animate([

                    {
                        transform:
                            'translate(0,0) scale(1)',
                        opacity:1
                    },

                    {
                        transform:
                            `translate(${dx}px,${dy}px) scale(0)`,
                        opacity:0
                    }

                ],{

                    duration:
                        1400 + Math.random()*600,

                    easing:'cubic-bezier(0.1,0.8,0.2,1)',

                    fill:'forwards'

                });

                setTimeout(()=>{

                    p.remove();

                },2200);
            }

            // flash sáng
            createFlash(layer,x,y);
        }

        // =====================================
        // FLASH SÁNG
        // =====================================

        function createFlash(layer,x,y){

            const flash =
                document.createElement('div');

            flash.style.position = 'absolute';

            flash.style.left = x + 'px';
            flash.style.top = y + 'px';

            flash.style.width = '10px';
            flash.style.height = '10px';

            flash.style.borderRadius = '50%';

            flash.style.background = 'white';

            flash.style.boxShadow =
                `
                0 0 30px white,
                0 0 60px white,
                0 0 120px white
                `;

            layer.appendChild(flash);

            flash.animate([

                {
                    transform:'scale(0)',
                    opacity:1
                },

                {
                    transform:'scale(8)',
                    opacity:0
                }

            ],{

                duration:500,
                easing:'ease-out',
                fill:'forwards'
            });

            setTimeout(()=>{

                flash.remove();

            },500);
        }

        // =====================================
        // RANDOM COLOR CẦU VỒNG
        // =====================================

        function randomColor(){

            const colors = [
                '#ff0000',
                '#ff8800',
                '#ffff00',
                '#00ff00',
                '#00ffff',
                '#0088ff',
                '#4444ff',
                '#aa00ff',
                '#ff00aa',
                '#ffffff'
            ];

            return colors[
                Math.floor(
                    Math.random()*colors.length
                )
            ];
        }

        console.log(
            'ĐÃ KÍCH HOẠT PHÁO HOA MỚI'
        );
    }

})();