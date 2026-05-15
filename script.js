const STEP = 6.666;

const COORDINATES_MAP = {
0:[6,13],1:[6,12],2:[6,11],3:[6,10],4:[6,9],5:[5,8],
6:[4,8],7:[3,8],8:[2,8],9:[1,8],10:[0,8],11:[0,7],
12:[0,6],13:[1,6],14:[2,6],15:[3,6],16:[4,6],17:[5,6],
18:[6,5],19:[6,4],20:[6,3],21:[6,2],22:[6,1],23:[6,0],
24:[7,0],25:[8,0],26:[8,1],27:[8,2],28:[8,3],29:[8,4],
30:[8,5],31:[9,6],32:[10,6],33:[11,6],34:[12,6],35:[13,6],
36:[14,6],37:[14,7],38:[14,8],39:[13,8],40:[12,8],41:[11,8],
42:[10,8],43:[9,8],44:[8,9],45:[8,10],46:[8,11],47:[8,12],
48:[8,13],49:[8,14],50:[7,14],51:[6,14],

100:[7,13],101:[7,12],102:[7,11],103:[7,10],104:[7,9],

200:[1,7],201:[2,7],202:[3,7],203:[4,7],204:[5,7],

300:[7,1],301:[7,2],302:[7,3],303:[7,4],304:[7,5],

400:[13,7],401:[12,7],402:[11,7],403:[10,7],404:[9,7],

500:[1.55,10.58],501:[3.45,10.58],502:[1.55,12.43],503:[3.45,12.43],
600:[1.55,1.58],601:[3.45,1.58],602:[1.55,3.45],603:[3.45,3.45],
700:[10.5,1.58],701:[12.4,1.58],702:[10.5,3.45],703:[12.4,3.45],
800:[10.5,10.58],801:[12.4,10.58],802:[10.5,12.43],803:[12.4,12.43]
};

const START_POS = { P1:0, P2:13, P3:26, P4:39 };
const TURN_HOME = { P1:51, P2:12, P3:25, P4:38 };
const HOME_BASE = { P1:100, P2:200, P3:300, P4:400 };

const HOME_YARD = {
P1:[500,501,502,503],
P2:[600,601,602,603],
P3:[700,701,702,703],
P4:[800,801,802,803]
};

const PLAYER_NAMES = {
P1:'Vàng',
P2:'Xanh Lá',
P3:'Đỏ',
P4:'Xanh Dương'
};

class LudoGame{

constructor(){
    this.players = ['P1','P2','P3','P4'];
    this.turn = 0;

    this.positions = {
        P1:[500,501,502,503],
        P2:[600,601,602,603],
        P3:[700,701,702,703],
        P4:[800,801,802,803]
    };

    this.dice1 = 0;
    this.dice2 = 0;
    this.diceValue = 0;

    this.canRelease = false;
    this.isDouble = false;

    this.init();
}

init(){

    const diceBtn = document.getElementById('dice-btn');

    diceBtn.addEventListener('click',()=>{
        if(!diceBtn.disabled){
            this.roll();
        }
    });

    document.querySelectorAll('.player-piece').forEach(piece=>{

        piece.addEventListener('click',(e)=>{
            this.handleMove(e.target);
        });

    });

    document.getElementById('reset-btn').addEventListener('click',()=>{
        location.reload();
    });

    this.updateUI();
}

roll(){

    document.getElementById('dice-btn').disabled = true;

    this.clearHighlights();

    this.dice1 = Math.floor(Math.random()*6)+1;
    this.dice2 = Math.floor(Math.random()*6)+1;

    this.diceValue = this.dice1 + this.dice2;

    this.isDouble = this.dice1 === this.dice2;

    this.canRelease =
        this.isDouble ||
        (
            (this.dice1 === 1 && this.dice2 === 6) ||
            (this.dice1 === 6 && this.dice2 === 1)
        );

    const d1 = document.getElementById('dice1');
    const d2 = document.getElementById('dice2');

    d1.style.animation = 'rolling 1s linear';
    d2.style.animation = 'rolling 1s linear';

    setTimeout(()=>{

        d1.style.animation = 'none';
        d2.style.animation = 'none';

        this.setDiceFace(d1,this.dice1);
        this.setDiceFace(d2,this.dice2);

        document.getElementById('dice-value').innerText =
            `${this.dice1} + ${this.dice2} = ${this.diceValue}`;

        this.highlightMoves();

    },1000);
}

setDiceFace(dice,val){

    const rotations = {
        1:'rotateX(0deg)',
        2:'rotateX(180deg)',
        3:'rotateY(-90deg)',
        4:'rotateY(90deg)',
        5:'rotateX(-90deg)',
        6:'rotateX(90deg)'
    };

    dice.style.transform = rotations[val];
}

clearHighlights(){

    document.querySelectorAll('.player-piece').forEach(p=>{
        p.classList.remove('highlight');
    });

}

getPieceAt(pos){

    for(const p in this.positions){

        for(let i=0; i<4; i++){

            if(this.positions[p][i] === pos){

                return {
                    player:p,
                    index:i
                };

            }
        }
    }

    return null;
}

canReleasePiece(player){

    const start = START_POS[player];

    const piece = this.getPieceAt(start);

    if(!piece) return true;

    return piece.player !== player;
}

// ================== KIỂM TRA CHIẾN THẮNG 5-4-3-2 ==================

checkWin(player){

    const homeBase = HOME_BASE[player];

    const homePos = this.positions[player].filter(pos =>
        pos >= homeBase && pos <= homeBase + 4
    );

    if(homePos.length !== 4) return;

    const levels = homePos
        .map(pos => pos - homeBase)
        .sort((a,b) => b - a);

    const has5 = levels.includes(4);
    const has4 = levels.includes(3);
    const has3 = levels.includes(2);
    const has2 = levels.includes(1);

    if(has5 && has4 && has3 && has2){

        // Không hiện bảng thắng
        // Không reset game

    }
}

// ================================================================

// ================================================================

canMove(player,pos,steps){

    // ================= QUÂN TRONG SÂN NHÀ =================

    if(pos >= 500){

        return this.canRelease && this.canReleasePiece(player);
    }

    // ================= QUÂN ĐANG TRONG CHUỒNG =================

    if(pos >= 100){

        if(!this.isDouble) return false;

        const homeBase = HOME_BASE[player];

        const currentLevel = pos - homeBase;

        const nextLevel = currentLevel + 1;

        if(nextLevel > 4) return false;

        // KHÔNG ĐƯỢC XUYÊN QUÂN

        for(let lv = currentLevel + 1; lv <= nextLevel; lv++){

            const checkPos = homeBase + lv;

            const piece = this.getPieceAt(checkPos);

            if(piece && piece.player === player){

                if(checkPos !== pos){
                    return false;
                }
            }
        }

        return true;
    }

    // ================= ĐƯỜNG NGOÀI =================

    if(this.isBlocked(player,pos,steps)) return false;

    let current = pos;

    for(let i=0; i<steps; i++){

        if(current === TURN_HOME[player]){

            const remain = steps - i - 1;

            if(remain >= 5) return false;

            const target = HOME_BASE[player] + remain;

            // KIỂM TRA BỊ CHẶN TRONG CHUỒNG

            const homeBase = HOME_BASE[player];

            for(let lv=0; lv<=remain; lv++){

                const checkPos = homeBase + lv;

                const piece = this.getPieceAt(checkPos);

                if(piece && piece.player === player){

                    if(checkPos !== target){
                        return false;
                    }
                }
            }

            const same = this.getPieceAt(target);

            if(same && same.player === player) return false;

            return true;
        }

        current = (current + 1) % 52;
    }

    const same = this.getPieceAt(current);

    if(same && same.player === player) return false;

    return true;
}

getDestination(player,pos,steps){

    if(pos >= 500){
        return START_POS[player];
    }

    if(pos >= 100){
        return pos + 1;
    }

    let current = pos;

    for(let i=0; i<steps; i++){

        if(current === TURN_HOME[player]){

            const remain = steps - i - 1;

            return HOME_BASE[player] + remain;
        }

        current = (current + 1) % 52;
    }

    return current;
}

kickEnemy(pos,currentPlayer){

    const target = this.getPieceAt(pos);

    if(!target) return;

    if(target.player === currentPlayer) return;

    if(pos >= 100) return;

    const home = HOME_YARD[target.player];

    for(let i=0; i<home.length; i++){

        if(!this.positions[target.player].includes(home[i])){

            this.positions[target.player][target.index] = home[i];

            break;
        }
    }
}

highlightMoves(){

    const player = this.players[this.turn];

    let hasMove = false;

    this.positions[player].forEach((pos,idx)=>{

        let possible = false;

        if(pos >= 100){

            possible = this.canMove(player,pos,1);

        }else if(this.isDouble){

            possible =
                this.canMove(player,pos,this.dice1) ||
                this.canMove(player,pos,this.diceValue);

        }else{

            possible = this.canMove(player,pos,this.diceValue);
        }

        if(possible){

            hasMove = true;

            document
                .querySelector(`[player-id="${player}"][piece="${idx}"]`)
                .classList.add('highlight');
        }

    });

    if(!hasMove){

        setTimeout(()=>{

            if(this.canRelease){

                document.getElementById('dice-btn').disabled = false;

            }else{

                this.nextTurn();
            }

        },700);
    }
}

handleMove(el){

    if(!el.classList.contains('highlight')) return;

    const player = el.getAttribute('player-id');

    if(player !== this.players[this.turn]) return;

    const idx = parseInt(el.getAttribute('piece'));

    const pos = this.positions[player][idx];

    let steps = this.diceValue;

    if(pos >= 100){

        steps = 1;

    }else if(this.isDouble && pos < 500){

        const full = confirm(
            `Bạn đổ ${this.dice1}-${this.dice2}\n\nOK = đi ${this.diceValue}\nCancel = đi ${this.dice1}`
        );

        steps = full ? this.diceValue : this.dice1;
    }

    if(!this.canMove(player,pos,steps)) return;

    const dest = this.getDestination(player,pos,steps);

    if(pos >= 500){
        this.kickEnemy(dest,player);
    }

    if(dest < 100){
        this.kickEnemy(dest,player);
    }

    this.positions[player][idx] = dest;

    this.updateUI();

    this.checkWin(player);

    this.clearHighlights();

    setTimeout(()=>{

        if(this.canRelease){

            document.getElementById('dice-btn').disabled = false;

        }else{

            this.nextTurn();
        }

    },500);
}

nextTurn(){

    this.turn = (this.turn + 1) % 4;

    document.getElementById('dice-btn').disabled = false;

    this.updateUI();
}

isBlocked(player,pos,steps){

    let current = pos;

    for(let i=0; i<steps; i++){

        if(current === TURN_HOME[player]) return false;

        current = (current + 1) % 52;

        const piece = this.getPieceAt(current);

        if(piece && i !== steps - 1){
            return true;
        }
    }

    return false;
}

updateUI(){

    const active = this.players[this.turn];

    document.querySelector('.active-player span').innerText = active;

    document.querySelectorAll('.player-base').forEach(base=>{
        base.classList.remove('highlight');
    });

    document
        .querySelector(`.player-base[player-id="${active}"]`)
        .classList.add('highlight');

    for(const player in this.positions){

        this.positions[player].forEach((pos,idx)=>{

            const piece = document.querySelector(
                `[player-id="${player}"][piece="${idx}"]`
            );

            const coord = COORDINATES_MAP[pos];

            if(coord){

                piece.style.left =
                    ((coord[0]+0.5)*STEP)+'%';

                piece.style.top =
                    ((coord[1]+0.5)*STEP)+'%';
            }

        });

    }
}
}

window.game = new LudoGame();

// ================= CHẶN CHUỘT PHẢI =================

document.addEventListener('contextmenu',function(e){
    e.preventDefault();
});

// ================= CHẶN BÔI ĐEN =================

document.addEventListener('selectstart',function(e){
    e.preventDefault();
});

// ================= CHẶN KÉO THẢ ẢNH =================

document.addEventListener('dragstart',function(e){
    e.preventDefault();
});