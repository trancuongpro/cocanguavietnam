(function(){

// ============================
// NỘI DUNG HƯỚNG DẪN
// ============================

const HUONGDAN = `

- Đổ Xí Ngầu Để Di Chuyển

- Bạn Xem Quân Cờ Nào Xoay Là Quân Sẽ Di Chuyển Hay Xuất Quân

- Chạm Vào Quân Cờ Lập Tức Di Chuyển

- Đổ Ra 1 6 , 1 1 , 2 2 , 3 3 , 4 4 , 5 5 , 6 6 sẽ được thêm lượt nữa

- Xí Ngầu Ra Quân Là 1 6 , 1 1 , 2 2 , 3 3 , 4 4 , 5 5 , 6 6

- Xí Ngầu Nhích Trong Chuồng 1 1 , 2 2 , 3 3 , 4 4 , 5 5 , 6 6

- Game Có Đá Quân Về Chuồng Và Lưu Số Lần Bị Đá Khi Kết Thúc

- Người Thắng Cuộc Phải Về Theo 5 4 3 2

- Trận Đấu Dừng Và Hệ Thống Tính Ra Các Hạng Còn Lại Theo Số Quân Trên Bàn Cờ

- Chúc Mọi Người Chơi Vui Vẻ Với Game Cờ Cá Ngựa Của Mình

- Trần Cường . Zalo: 0907860662

`;

// ============================
// TẠO BẢNG HƯỚNG DẪN
// ============================

const board = document.createElement('div');

board.id = 'huongdan-board';

board.innerHTML = `

    <div class="huongdan-box">

        <div class="huongdan-title">
            Hướng Dẫn Game Cờ Cá Ngựa
        </div>

        <div class="huongdan-content">
            ${HUONGDAN.replace(/\n/g,'<br>')}
        </div>

        <button id="close-huongdan">
            OK
        </button>

    </div>

`;

document.body.appendChild(board);

// ============================
// BUTTON MỞ
// ============================

const openBtn = document.getElementById('huongdan-btn');

openBtn.addEventListener('click',()=>{

    board.style.display = 'flex';

});

// ============================
// BUTTON ĐÓNG
// ============================

document
    .getElementById('close-huongdan')
    .addEventListener('click',()=>{

        board.style.display = 'none';

    });

})();