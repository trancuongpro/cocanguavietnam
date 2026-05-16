// ==============================
// BOT XANH DƯƠNG P4
// ==============================

function runBotP4(){

    if(typeof game === 'undefined') return;

    if(GAME_MODE.P4 !== 'bot') return;

    if(game.players[game.turn] !== 'P4') return;

    if(BOT_BUSY) return;

    const activeBase =
        document.querySelector(
            '.player-base.highlight'
        );

    if(!activeBase) return;

    if(activeBase.getAttribute('player-id') !== 'P4'){
        return;
    }

    BOT_BUSY = true;

    const diceBtn =
        document.getElementById('dice-btn');

    diceBtn.click();

    setTimeout(()=>{

        const move =
            BotCore.think(game,'P4');

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
            `[player-id="P4"][piece="${move.index}"]`
        );

        if(piece){

            piece.click();
        }

        setTimeout(()=>{

            BOT_BUSY = false;

        },800);

    },2300);
}

window.BOT_P4_LOOP =
setInterval(()=>{

    if(
        typeof GAME_MODE !== 'undefined' &&
        GAME_MODE.P4 === 'bot'
    ){

        runBotP4();
    }

},400);