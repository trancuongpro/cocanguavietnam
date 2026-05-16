// =====================================
// BOT CORE AI - ULTRA HARD
// =====================================

window.BotCore = {

    // =================================
    // KIỂM TRA NGUY HIỂM
    // =================================

    isDanger(game,player,dest){

        for(const enemyPlayer in game.positions){

            if(enemyPlayer === player) continue;

            for(const ep of game.positions[enemyPlayer]){

                if(ep >= 100) continue;

                const dist =
                    (dest - ep + 52) % 52;

                // nằm trong vùng dễ bị đá

                if(dist >= 1 && dist <= 6){

                    return true;
                }
            }
        }

        return false;
    },

    // =================================
    // ĐẾM QUÂN CÓ THỂ ĐÁ
    // =================================

    countKickTargets(game,player,dest){

        let count = 0;

        for(const enemyPlayer in game.positions){

            if(enemyPlayer === player) continue;

            game.positions[enemyPlayer]
            .forEach(ep=>{

                if(ep === dest){

                    count++;
                }

            });
        }

        return count;
    },

    // =================================
    // ĐÁNH GIÁ NƯỚC ĐI
    // =================================

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

        // =================================
        // ĐÁ QUÂN
        // =================================

        const kickCount =
            this.countKickTargets(
                game,
                player,
                dest
            );

        if(kickCount > 0){

            score += kickCount * 5000;
        }

        // =================================
        // ƯU TIÊN VỀ ĐÍCH
        // =================================

        if(dest >= 100){

            score += 3000;

            // ưu tiên lên cao

            if(dest === 105) score += 9000;
            if(dest === 104) score += 7000;
            if(dest === 103) score += 5000;
            if(dest === 102) score += 3000;

            // tránh ô 101

            if(dest === 101){

                score -= 4000;
            }
        }

        // =================================
        // RA QUÂN
        // =================================

        if(pos >= 500){

            score += 1200;
        }

        // =================================
        // ƯU TIÊN TIẾN XA
        // =================================

        score += dest * 4;

        // =================================
        // CHẶN ĐẦU
        // =================================

        for(const enemyPlayer in game.positions){

            if(enemyPlayer === player) continue;

            game.positions[enemyPlayer]
            .forEach(ep=>{

                if(ep >= 100) return;

                const dist =
                    (ep - dest + 52) % 52;

                // đứng chặn trước mặt

                if(dist >= 1 && dist <= 2){

                    score += 800;
                }

                // đứng sát sau lưng địch

                if(dist >= 50){

                    score += 500;
                }
            });
        }

        // =================================
        // NÉ NGUY HIỂM
        // =================================

        if(this.isDanger(
            game,
            player,
            dest
        )){

            score -= 2500;
        }

        // =================================
        // DOUBLE ƯU TIÊN ĐI TỔNG
        // =================================

        if(game.isDouble){

            if(steps === game.diceValue){

                score += 700;
            }
        }

        // =================================
        // LUẬT ĐẶC BIỆT
        // =================================

        if(
            (pos === 2 && steps === 3) ||
            (pos === 3 && steps === 4) ||
            (pos === 4 && steps === 5)
        ){

            score += 6000;
        }

        // =================================
        // ƯU TIÊN ĐƯỜNG VỀ
        // =================================

        if(pos >= 100){

            score += 1500;
        }

        return score;
    },

    // =================================
    // SUY NGHĨ
    // =================================

    think(game,player){

        const results = [];

        game.positions[player]
        .forEach((pos,index)=>{

            // =============================
            // QUÂN TRONG NHÀ
            // =============================

            if(pos >= 500){

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

            // =============================
            // ĐI TỔNG
            // =============================

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

            // =============================
            // DOUBLE ĐI NỬA
            // =============================

            if(game.isDouble){

                const halfScore =
                    this.evaluateMove(
                        game,
                        player,
                        index,
                        game.dice1
                    );

                results.push({

                    index,
                    steps:game.dice1,
                    score:halfScore

                });
            }

        });

        if(results.length <= 0){

            return null;
        }

        // =================================
        // SẮP XẾP THÔNG MINH
        // =================================

        results.sort((a,b)=>{

            // ưu tiên score

            if(b.score !== a.score){

                return b.score - a.score;
            }

            // nếu bằng điểm
            // ưu tiên bước lớn

            return b.steps - a.steps;
        });

        return results[0];
    }
};