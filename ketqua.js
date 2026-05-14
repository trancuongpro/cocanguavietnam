// ======================================================
//      HỆ THỐNG KẾT QUẢ - THỐNG KÊ ĐUA NGỰA
// ======================================================

(function(){

// =============================
// DỮ LIỆU THỐNG KÊ
// =============================

const THONGKE = {

    P1:{
        name:'Vàng',
        color:'#f1c40f',
        kicked:0,
        home:[]
    },

    P2:{
        name:'Xanh Lá',
        color:'#27ae60',
        kicked:0,
        home:[]
    },

    P3:{
        name:'Đỏ',
        color:'#e74c3c',
        kicked:0,
        home:[]
    },

    P4:{
        name:'Xanh Dương',
        color:'#3498db',
        kicked:0,
        home:[]
    }
};

// =============================
// RESET THỐNG KÊ
// =============================

window.addEventListener('beforeunload',()=>{

    localStorage.removeItem('ketqua-thongke');

});

// =============================
// THEO DÕI QUÂN BỊ ĐÁ
// =============================

const originalKickEnemy = LudoGame.prototype.kickEnemy;

LudoGame.prototype.kickEnemy = function(pos,currentPlayer){

    const target = this.getPieceAt(pos);

    if(
        target &&
        target.player !== currentPlayer &&
        pos < 100
    ){

        THONGKE[target.player].kicked++;
    }

    originalKickEnemy.call(this,pos,currentPlayer);
};

// =============================
// THEO DÕI QUÂN VÀO CHUỒNG
// =============================

const originalCheckWin = LudoGame.prototype.checkWin;

LudoGame.prototype.checkWin = function(player){

    const homeBase = HOME_BASE[player];

    THONGKE[player].home = this.positions[player]
        .filter(pos=> pos >= homeBase && pos <= homeBase+4)
        .map(pos=> pos-homeBase)
        .sort((a,b)=> b-a);

    const levels = THONGKE[player].home;

    const has5 = levels.includes(4);
    const has4 = levels.includes(3);
    const has3 = levels.includes(2);
    const has2 = levels.includes(1);

    // =============================
    // KHI CÓ NGƯỜI THẮNG
    // =============================

    if(has5 && has4 && has3 && has2){

        setTimeout(()=>{

            showRankingBoard();

        },300);
    }

    originalCheckWin.call(this,player);
};

// =============================
// TÍNH ĐIỂM XẾP HẠNG
// =============================

function getRankScore(player){

    const data = THONGKE[player];

    const levels = data.home;

    let score = 0;

    if(levels.includes(4)) score += 500;
    if(levels.includes(3)) score += 400;
    if(levels.includes(2)) score += 300;
    if(levels.includes(1)) score += 200;

    // ít bị đá hơn => mạnh hơn
    score -= data.kicked;

    return score;
}

// =============================
// HIỂN THỊ BẢNG KẾT QUẢ
// =============================

function showRankingBoard(){

    const old = document.getElementById('bang-ketqua');

    if(old) old.remove();

    const players = ['P1','P2','P3','P4'];

    players.sort((a,b)=>{

        return getRankScore(b) - getRankScore(a);

    });

    const ranks = [
        '🥇 HẠNG NHẤT',
        '🥈 HẠNG NHÌ',
        '🥉 HẠNG BA',
        '🐴 HẠNG CHÓT'
    ];

    const board = document.createElement('div');

    board.id = 'bang-ketqua';

    board.style.position = 'fixed';
    board.style.left = '50%';
    board.style.top = '56%';
    board.style.transform = 'translate(-50%,-50%)';
    board.style.width = '340px';
    board.style.maxWidth = '92vw';
    board.style.background = '#b30000';
    board.style.border = '5px solid #111';
    board.style.borderRadius = '14px';
    board.style.padding = '18px';
    board.style.zIndex = '999999';
    board.style.boxShadow = '0 0 30px rgba(0,0,0,0.8)';
    board.style.fontFamily = 'Arial';

    let html = '';

    html += `
        <div style="
            text-align:center;
            color:white;
            font-size:22px;
            font-weight:bold;
            margin-bottom:18px;
            text-shadow:0 0 10px black;
        ">
            🏇 Kết Quả Thống Kê Trận Đua Ngựa 🏇
        </div>
    `;

    players.forEach((p,index)=>{

        const data = THONGKE[p];

        const levelsText =
            data.home.length > 0
            ? data.home.map(v=>v+1).join(' - ')
            : 'Chưa hoàn thành';

        let bg = '#333';

        if(index === 0) bg = '#c99700';
        if(index === 1) bg = '#7f8c8d';
        if(index === 2) bg = '#a0522d';
        if(index === 3) bg = '#2c3e50';

        html += `

            <div style="
                background:${bg};
                border:2px solid white;
                border-radius:10px;
                padding:10px;
                margin-bottom:10px;
                color:white;
            ">

                <div style="
                    font-size:18px;
                    font-weight:bold;
                    margin-bottom:6px;
                ">
                    ${ranks[index]}
                </div>

                <div style="
                    color:${data.color};
                    font-size:20px;
                    font-weight:bold;
                    margin-bottom:6px;
                    text-shadow:0 0 8px black;
                ">
                    Quân Cờ ${data.name}
                </div>

                <div style="
                    font-size:15px;
                    line-height:1.6;
                ">
                    ✅ Vị Trí Đạt Được:
                    <b>${levelsText}</b>
                    <br>

                    💥 Số Lần Bị Đá:
                    <b style="color:#ffe082;">
                        ${data.kicked}
                    </b>
                </div>

            </div>

        `;
    });

    board.innerHTML = html;

    document.body.appendChild(board);
}

})();