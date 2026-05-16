// ==============================
// BOT ĐỎ P3
// ==============================

function runBotP3(){

    if(typeof game === 'undefined') return;

    if(GAME_MODE.P3 !== 'bot') return;

    if(game.players[game.turn] !== 'P3') return;

    if(BOT_BUSY) return;

    const activeBase =
        document.querySelector(
            '.player-base.highlight'
        );

    if(!activeBase) return;

    if(activeBase.getAttribute('player-id') !== 'P3'){
        return;
    }

    BOT_BUSY = true;

    const diceBtn =
        document.getElementById('dice-btn');

    diceBtn.click();

    setTimeout(()=>{

        const move =
            BotCore.think(game,'P3');

        if(move === null){

            BOT_BUSY = false;
            return;
        }

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
            `[player-id="P3"][piece="${move.index}"]`
        );

        if(piece){

            piece.click();
        }

        setTimeout(()=>{

            BOT_BUSY = false;

        },800);

    },2300);
}

window.BOT_P3_LOOP =
setInterval(()=>{

    if(
        typeof GAME_MODE !== 'undefined' &&
        GAME_MODE.P3 === 'bot'
    ){

        runBotP3();
    }

},400);