// =============================
// MODE GAME
// =============================

window.GAME_MODE = {

    P1:'human',
    P2:'bot',
    P3:'bot',
    P4:'bot'
};

// =============================

const modeBoard = document.createElement('div');

modeBoard.id = 'modegame-board';

modeBoard.innerHTML = `

<div class="modegame-box">

    <div class="modegame-title">
        Chọn Chế Độ Chơi
    </div>

    <div class="mode-row">
        <label>
            Quân Vàng P1 Bạn Điều Khiển
        </label>
    </div>

    <div class="mode-row">

        <label>
            Quân Xanh Lá P2
        </label>

        <select id="mode-p2" class="mode-select">

            <option value="human">
                Người
            </option>

            <option value="bot" selected>
                Bot
            </option>

        </select>

    </div>

    <div class="mode-row">

        <label>
            Quân Đỏ P3
        </label>

        <select id="mode-p3" class="mode-select">

            <option value="human">
                Người
            </option>

            <option value="bot" selected>
                Bot
            </option>

        </select>

    </div>

    <div class="mode-row">

        <label>
            Quân Xanh P4
        </label>

        <select id="mode-p4" class="mode-select">

            <option value="human">
                Người
            </option>

            <option value="bot" selected>
                Bot
            </option>

        </select>

    </div>

    <button id="save-modegame">
        OK Xác Nhận
    </button>

</div>
`;

document.body.appendChild(modeBoard);

// =============================
// MỞ BẢNG
// =============================

document
.getElementById('modegame-btn')
.addEventListener('click',()=>{

    modeBoard.style.display = 'flex';
});

// =============================
// SAVE MODE
// =============================

document
.getElementById('save-modegame')
.addEventListener('click',()=>{

    GAME_MODE.P2 =
        document.getElementById('mode-p2').value;

    GAME_MODE.P3 =
        document.getElementById('mode-p3').value;

    GAME_MODE.P4 =
        document.getElementById('mode-p4').value;

    // =========================
    // ĐÓNG BẢNG
    // =========================

    modeBoard.style.display = 'none';

    // =========================
    // RESET GAME
    // =========================

    setTimeout(()=>{

        location.reload();

    },300);

});