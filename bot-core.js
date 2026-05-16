// =====================================
// BOT CORE AI - ULTRA HARD (MAX INTELLIGENCE)
// =====================================

window.BotCore = {

    // =================================
    // KIỂM TRA NGUY HIỂM (CÓ BỊ ĐỊCH ĐÁ KHÔNG)
    // =================================
    isDanger(game, player, dest) {
        // Nếu đã an toàn trong chuồng sâu (từ ô số 2 trở lên), không sợ bị đá ngoài đường
        if (dest > game.getDestination(player, HOME_BASE[player], 1)) {
            return false;
        }

        for (const enemyPlayer in game.positions) {
            if (enemyPlayer === player) continue;

            for (const ep of game.positions[enemyPlayer]) {
                if (ep >= 100) continue; // Quân địch trong chuồng không đá được ta ngoài đường

                const dist = (dest - ep + 52) % 52;

                // Nằm trong vùng đổ xúc xắc từ 1 đến 6 của địch
                if (dist >= 1 && dist <= 6) {
                    return true;
                }
            }
        }
        return false;
    },

    // =================================
    // ĐẾM QUÂN CÓ THỂ ĐÁ TRỰC TIẾP
    // =================================
    countKickTargets(game, player, dest) {
        let count = 0;
        for (const enemyPlayer in game.positions) {
            if (enemyPlayer === player) continue;

            game.positions[enemyPlayer].forEach(ep => {
                if (ep === dest) {
                    count++;
                }
            });
        }
        return count;
    },

    // =================================
    // KIỂM TRA KHẢ NĂNG KÍCH HOẠT ĐÁ DÂY CHUYỀN (LUẬT DACBIET.JS)
    // =================================
    checkChainKickSuccess(game, player, oldPos, newPos) {
        if (oldPos === newPos || oldPos >= 100 || newPos >= 100) return false;

        let steps = (newPos - oldPos + 52) % 52;
        if (steps < 1 || steps > 6) return false;

        let hasChainKick = false;
        const allPlayers = ['P1', 'P2', 'P3', 'P4'];

        allPlayers.forEach(enemy => {
            if (enemy === player) return;

            game.positions[enemy].forEach(enemyPos => {
                if (enemyPos >= 100) return; // Bỏ qua quân trong nhà/chuồng

                const dist = (enemyPos - oldPos + 52) % 52;
                if (dist === steps) {
                    hasChainKick = true; // Phát hiện mục tiêu sẽ bị đá dây chuyền
                }
            });
        });

        return hasChainKick;
    },

    // =================================
    // ĐÁNH GIÁ NƯỚC ĐI CHI TIẾT
    // =================================
    evaluateMove(game, player, index, steps) {
        const pos = game.positions[player][index];

        // Nếu nước đi không hợp lệ theo core game, loại bỏ ngay
        if (!game.canMove(player, pos, steps)) {
            return -999999;
        }

        // Lấy điểm đến (Tự động áp dụng luật ưu ái chuồng nếu dacbiet.js đã nạp)
        const dest = game.getDestination(player, pos, steps);
        const homeBase = HOME_BASE[player];

        let score = 0;

        // =================================
        // 1. ĐÁ QUÂN TRỰC TIẾP & ĐÁ DÂY CHUYỀN
        // =================================
        const kickCount = this.countKickTargets(game, player, dest);
        if (kickCount > 0) {
            score += kickCount * 6000; // Điểm cực cao cho việc triệt hạ đối phương
        }

        // Tích hợp luật đặc biệt: Đá dây chuyền từ dacbiet.js
        if (this.checkChainKickSuccess(game, player, pos, dest)) {
            score += 8000; // Ưu tiên hàng đầu vì đá dây chuyền tạo lợi thế cực lớn
        }

        // =================================
        // 2. ƯU TIÊN VỀ ĐÍCH VÀ NÉ Ô 1 CHUỒNG
        // =================================
        if (dest >= 100) {
            score += 4000; // Điểm nền khi vào được chuồng an toàn

            const chuongLevel = dest - homeBase; // Cấp độ chuồng (1, 2, 3, 4, 5)

            // Ưu tiên chiếm lĩnh các vị trí cao tiến tới chiến thắng hoàn hảo
            if (chuongLevel === 5) score += 10000;
            if (chuongLevel === 4) score += 8000;
            if (chuongLevel === 3) score += 6000;
            if (chuongLevel === 2) score += 4000;

            // CHIẾN LƯỢC PHÒNG THỦ: Tránh đứng lại ở ô số 1 của chuồng (Ô hiểm họa)
            if (chuongLevel === 1) {
                score -= 8000; // Trừ điểm nặng để ép bot không chọn đứng ở vị trí này nếu còn nước khác
            }
        }

        // =================================
        // 3. CHIẾN LƯỢC RA QUÂN THÔNG MINH
        // =================================
        if (pos >= 500) {
            score += 2000; // Điểm cơ bản muốn xuất chuồng

            // Phân tích xem cửa ra quân (START_POS) có đang bị kẻ địch bao vây phục kích không
            const startPosition = START_POS[player];
            if (this.isDanger(game, player, startPosition)) {
                score -= 4500; // Trừ điểm nếu ra quân vào thế bị động dâng mạng cho địch
            }
        }

        // =================================
        // 4. ƯU TIÊN TIẾN XA TRÊN ĐƯỜNG ĐI
        // =================================
        if (dest < 100) {
            score += dest * 5; 
        }

        // =================================
        // 5. CHẶN ĐẦU VÀ KHÓA ĐUÔI ĐỐI THỦ
        // =================================
        for (const enemyPlayer in game.positions) {
            if (enemyPlayer === player) continue;

            game.positions[enemyPlayer].forEach(ep => {
                if (ep >= 100) return;

                const dist = (ep - dest + 52) % 52;

                // Đứng chặn ngay trước mặt địch (cách 1-2 ô) khiến địch bị kẹt
                if (dist >= 1 && dist <= 2) {
                    score += 1000;
                }

                // Đứng ngay sau lưng địch (áp sát nút tạo áp lực tâm lý)
                if (dist >= 50) {
                    score += 600;
                }
            });
        }

        // =================================
        // 6. NÉ TRÁNH CÁC Ô NGUY HIỂM NGOÀI ĐƯỜNG CHẠY
        // =================================
        if (this.isDanger(game, player, dest)) {
            score -= 3000;
        }

        // =================================
        // 7. ƯU TIÊN ĐI TỔNG KHI ĐỔ ĐƯỢC ĐỒNG NHẤT (DOUBLE)
        // =================================
        if (game.isDouble) {
            if (steps === game.diceValue) {
                score += 800; // Khuyến khích đi trọn vẹn điểm xúc xắc lớn
            }
        }

        // =================================
        // 8. CHỚP THỜI CƠ LUẬT ƯU ÁI (DACBIET.JS)
        // =================================
        // Ô 2 + 3 bước, Ô 3 + 4 bước, Ô 4 + 5 bước -> Sẽ được kích hoạt nhảy cóc lên ô trên
        const currentLevelInChuong = pos - homeBase;
        if (pos >= 100 && pos < homeBase + 5) {
            if (
                (currentLevelInChuong === 1 && steps === 3) ||
                (currentLevelInChuong === 2 && steps === 4) ||
                (currentLevelInChuong === 3 && steps === 5)
            ) {
                score += 7500; // Cộng điểm cực mạnh để Bot ưu tiên thực hiện cú nhảy cóc này
            }
        }

        // =================================
        // 9. ƯU TIÊN DI CHUYỂN QUÂN ĐANG TRONG CHUỒNG LÊN CAO
        // =================================
        if (pos >= 100) {
            score += 1800; // Giúp giải phóng chuồng nhanh, không để các quân cản đường nhau
        }

        return score;
    },

    // =================================
    // TRUNG TÂM XỬ LÝ SUY NGHĨ CỦA AI
    // =================================
    think(game, player) {
        const results = [];

        game.positions[player].forEach((pos, index) => {

            // QUÂN ĐANG TRONG NHÀ (CHƯA XUẤT CHUỒNG)
            if (pos >= 500) {
                const score = this.evaluateMove(game, player, index, 1);
                results.push({
                    index,
                    steps: 1,
                    score
                });
                return;
            }

            // ĐI TỔNG ĐIỂM 2 XÚC XẮC
            const fullScore = this.evaluateMove(game, player, index, game.diceValue);
            results.push({
                index,
                steps: game.diceValue,
                score: fullScore
            });

            // NẾU ĐỔ ĐƯỢC DOUBLE (ĐỒNG NHẤT) -> ĐƯỢC PHÉP CHỌN ĐI MỘT NỬA (DICE 1)
            if (game.isDouble) {
                const halfScore = this.evaluateMove(game, player, index, game.dice1);
                results.push({
                    index,
                    steps: game.dice1,
                    score: halfScore
                });
            }
        });

        if (results.length <= 0) {
            return null;
        }

        // SẮP XẾP ĐỂ CHỌN NƯỚC ĐI TỐI ƯU NHẤT
        results.sort((a, b) => {
            // Ưu tiên hàng đầu: Điểm số đánh giá chiến thuật (Score) cao nhất
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            // Nếu bằng điểm nhau: Ưu tiên chọn đi bước dài hơn để bứt tốc nhanh hơn
            return b.steps - a.steps;
        });

        // Trả về nước đi tốt nhất tìm được
        return results[0];
    }
};