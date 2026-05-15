// =====================================
// BOT CORE AI
// =====================================

window.BotCore = {

    // ==============================
    // CHẤM ĐIỂM NƯỚC ĐI
    // ==============================

    evaluateMove(game,player,index,steps){

        const pos =
            game.positions[player][index];

        if(!game.canMove(player,pos,steps)){

            return -999999;
        }

        const dest =
            game.getDestination(
                player,
                pos,
                steps
            );

        let score = 0;

        // ==========================
        // ĐÁ QUÂN
        // ==========================

        const enemy =
            game.getPieceAt(dest);

        if(enemy && enemy.player !== player){

            score += 1000;
        }

        // ==========================
        // VÀO CHUỒNG
        // ==========================

        if(dest >= 100){

            score += 600;
        }

        // ==========================
        // RA QUÂN
        // ==========================

        if(pos >= 500){

            score += 400;
        }

        // ==========================
        // TIẾN XA
        // ==========================

        score += dest * 2;

        // ==========================
        // CHẶN ĐẦU
        // ==========================

        for(const enemyPlayer in game.positions){

            if(enemyPlayer === player) continue;

            game.positions[enemyPlayer].forEach(ep=>{

                if(ep < 100){

                    const distance =
                        Math.abs(ep - dest);

                    if(distance <= 2){

                        score += 120;
                    }
                }

            });
        }

        return score;
    },

    // ==============================
    // SUY NGHĨ NƯỚC ĐI
    // ==============================

    think(game,player){

        const results = [];

        game.positions[player].forEach((pos,index)=>{

            // ======================
            // QUÂN TRONG CHUỒNG
            // ======================

            if(pos >= 100){

                const score =
                    this.evaluateMove(
                        game,
                        player,
                        index,
                        1
                    );

                results.push({

                    index,
                    steps:1,
                    score

                });

                return;
            }

            // ======================
            // ĐI TỔNG
            // ======================

            const fullScore =
                this.evaluateMove(
                    game,
                    player,
                    index,
                    game.diceValue
                );

            results.push({

                index,
                steps:game.diceValue,
                score:fullScore

            });

            // ======================
            // NẾU DOUBLE
            // ======================

            if(game.isDouble){

                const singleScore =
                    this.evaluateMove(
                        game,
                        player,
                        index,
                        game.dice1
                    );

                results.push({

                    index,
                    steps:game.dice1,
                    score:singleScore

                });
            }

        });

        if(results.length <= 0){

            return null;
        }

        results.sort((a,b)=>b.score-a.score);

        return results[0];
    }
};