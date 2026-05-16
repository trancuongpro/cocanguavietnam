// ==============================
// BOT XANH LÁ P2
// ==============================

window.BOT_BUSY = false;

function runBotP2(){

    if(typeof game === 'undefined') return;

    if(GAME_MODE.P2 !== 'bot') return;

    if(game.players[game.turn] !== 'P2') return;

    if(BOT_BUSY) return;

    const activeBase =
        document.querySelector(
            '.player-base.highlight'
        );

    if(!activeBase) return;

    if(activeBase.getAttribute('player-id') !== 'P2'){
        return;
    }

    BOT_BUSY = true;

    const diceBtn =
        document.getElementById('dice-btn');

    // ==========================
    // ĐỔ NGAY
    // ==========================

    diceBtn.click();

    // ==========================
    // CHỜ XÍ NGẦU XOAY
    // ==========================

    setTimeout(()=>{

        const move =
            BotCore.think(game,'P2');

        if(move === null){

            BOT_BUSY = false;
            return;
        }

        // ======================
        // TỰ CHỌN OK / HỦY
        // ======================

        if(game.isDouble){

    const oldConfirm = window.confirm;

    window.confirm = ()=>{

        return move.steps === game.diceValue;
    };

    setTimeout(()=>{

        window.confirm = oldConfirm;

    },100);
}

        const piece = document.querySelector(
            `[player-id="P2"][piece="${move.index}"]`
        );

        if(piece){

            piece.click();
        }

        setTimeout(()=>{

            BOT_BUSY = false;

        },800);

    },2300);
}

window.BOT_P2_LOOP =
setInterval(()=>{

    if(
        typeof GAME_MODE !== 'undefined' &&
        GAME_MODE.P2 === 'bot'
    ){

        runBotP2();
    }

},400);