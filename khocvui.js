// =====================================
// khocvui.js
// CHỈ hiện khi bị đá về chuồng
// FIX CHUẨN
// =====================================

(function () {

    // đợi game load xong
    window.addEventListener('load',()=>{

        if(!window.game) return;

        const STEP = 6.666;

        // =========================
        // TỌA ĐỘ Ô CHUỒNG
        // =========================

        const COORDINATES_MAP = {

            500:[1.55,10.58],
            501:[3.45,10.58],
            502:[1.55,12.43],
            503:[3.45,12.43],

            600:[1.55,1.58],
            601:[3.45,1.58],
            602:[1.55,3.45],
            603:[3.45,3.45],

            700:[10.5,1.58],
            701:[12.4,1.58],
            702:[10.5,3.45],
            703:[12.4,3.45],

            800:[10.5,10.58],
            801:[12.4,10.58],
            802:[10.5,12.43],
            803:[12.4,12.43]
        };

        // =========================
        // CSS
        // =========================

        const style = document.createElement('style');

        style.innerHTML = `
            .khocvui-effect{

                position:absolute;

                width:90px;
                height:90px;

                transform:translate(-50%,-50%);

                pointer-events:none;

                z-index:999999999;

                animation:khocvui-shake .12s infinite;
            }

            .khocvui-effect img{

                width:100%;
                height:100%;

                object-fit:contain;
            }

            @keyframes khocvui-shake{

                0%{
                    transform:translate(-50%,-50%) rotate(0deg);
                }

                25%{
                    transform:translate(-50%,-50%) rotate(-5deg);
                }

                50%{
                    transform:translate(-50%,-50%) rotate(5deg);
                }

                75%{
                    transform:translate(-50%,-50%) rotate(-5deg);
                }

                100%{
                    transform:translate(-50%,-50%) rotate(0deg);
                }
            }
        `;

        document.head.appendChild(style);

        // =========================
        // HIỆN MÈO KHÓC
        // =========================

        function showCry(homePos){

            // chỉ cho 1 ảnh tồn tại
            const old =
                document.querySelector('.khocvui-effect');

            if(old){
                old.remove();
            }

            const board =
                document.querySelector('.ludo');

            if(!board) return;

            const coord =
                COORDINATES_MAP[homePos];

            if(!coord) return;

            const cry =
                document.createElement('div');

            cry.className =
                'khocvui-effect';

            cry.innerHTML =
                `<img src="meokhoc.png">`;

            cry.style.left =
                ((coord[0] + 0.5) * STEP) + '%';

            cry.style.top =
                ((coord[1] + 0.5) * STEP) + '%';

            board.appendChild(cry);

            setTimeout(()=>{

                cry.remove();

            },2000);
        }

        // =========================
        // GHI ĐÈ kickEnemy
        // =========================

        const originalKickEnemy =
            window.game.kickEnemy.bind(window.game);

        window.game.kickEnemy = function(pos,currentPlayer){

            // tìm quân chuẩn bị bị đá
            const target =
                this.getPieceAt(pos);

            // nếu không có quân
            if(!target){

                return originalKickEnemy(
                    pos,
                    currentPlayer
                );
            }

            // nếu cùng màu
            if(target.player === currentPlayer){

                return originalKickEnemy(
                    pos,
                    currentPlayer
                );
            }

            // nếu trong chuồng
            if(pos >= 100){

                return originalKickEnemy(
                    pos,
                    currentPlayer
                );
            }

            // tìm ô chuồng trống
            const HOME_YARD = {

                P1:[500,501,502,503],
                P2:[600,601,602,603],
                P3:[700,701,702,703],
                P4:[800,801,802,803]
            };

            let targetHome = null;

            for(const homePos of HOME_YARD[target.player]){

                if(
                    !this.positions[target.player]
                    .includes(homePos)
                ){
                    targetHome = homePos;
                    break;
                }
            }

            // chạy logic gốc
            originalKickEnemy(
                pos,
                currentPlayer
            );

            // hiện mèo khóc
            if(targetHome){

                showCry(targetHome);
            }
        };

    });

})();