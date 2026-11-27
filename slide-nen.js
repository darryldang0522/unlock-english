/* =========================================================
   SLIDE NỀN Ở BANNER TRANG CHỦ
   Các ảnh tự chuyển mờ dần ở phía sau chữ của banner.
   Bạn chỉ cần sửa PHẦN 1 và PHẦN 2.
   ========================================================= */

/* ---------- PHẦN 1: CÀI ĐẶT ---------- */
const SLIDE_NEN_CAI_DAT = {
  thoiGian: 6000     // thời gian mỗi ảnh (mili giây, 6000 = 6 giây). Đặt 0 để chỉ hiện ảnh đầu tiên, không chuyển
};

/* ---------- PHẦN 2: DANH SÁCH ẢNH ----------
   Mỗi dòng là đường dẫn tới một ảnh, nằm trong dấu nháy và cách nhau bằng dấu phẩy.
   Muốn THÊM ảnh: bỏ file vào thư mục "images", rồi thêm một dòng mới.
   Muốn XÓA ảnh: xóa dòng tương ứng.
   Nếu danh sách rỗng, banner chỉ có nền màu tím-cam như ban đầu.

   Gợi ý ảnh: nằm ngang, khoảng 1920 x 800 px, nhẹ dưới 300KB (đuôi .jpg hoặc .webp).
   Phần BÊN TRÁI ảnh sẽ bị phủ màu tím để chữ dễ đọc, nên đặt nội dung chính của ảnh
   (khuyến mãi, người, chữ) ở NỬA BÊN PHẢI.
*/
const SLIDE_NEN = [
  'images/slide-1.jpg',
  'images/slide-2.jpg',
  'images/slide-3.jpg'
];


/* =========================================================
   PHẦN 3: MÃ HIỂN THỊ (không cần sửa)
   ========================================================= */
(function () {
  const vung = document.getElementById('heroSlides');
  if (!vung || typeof SLIDE_NEN === 'undefined' || !SLIDE_NEN.length) return;

  const hero = vung.closest('.hero');

  // Tải thử từng ảnh; ảnh nào lỗi (sai tên, thiếu file) thì bỏ qua
  const taiAnh = function (duongDan) {
    return new Promise(function (xong) {
      const img = new Image();
      img.onload = function () { xong(duongDan); };
      img.onerror = function () { xong(null); };
      img.src = duongDan;
    });
  };

  Promise.all(SLIDE_NEN.map(taiAnh)).then(function (ketQua) {
    const ds = ketQua.filter(Boolean);
    if (!ds.length) return;

    const cacSlide = ds.map(function (duongDan) {
      const s = document.createElement('div');
      s.className = 'hero__slide';
      s.style.backgroundImage = 'url("' + duongDan.replace(/"/g, '%22') + '")';
      vung.appendChild(s);
      return s;
    });

    const cacDiem = [];
    let viTri = 0;
    let boDem = null;

    function hien(i) {
      viTri = (i + cacSlide.length) % cacSlide.length;
      cacSlide.forEach(function (s, k) { s.classList.toggle('is-active', k === viTri); });
      cacDiem.forEach(function (d, k) { d.classList.toggle('is-active', k === viTri); });
    }

    // Chấm tròn nhỏ ở góc phải dưới (chỉ khi có từ 2 ảnh trở lên)
    if (cacSlide.length > 1 && hero) {
      const hop = document.createElement('div');
      hop.className = 'hero__dots';
      cacSlide.forEach(function (_, k) {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'hero__dot';
        d.setAttribute('aria-label', 'Xem ảnh ' + (k + 1));
        d.addEventListener('click', function () { hien(k); khoiDong(); });
        cacDiem.push(d);
        hop.appendChild(d);
      });
      hero.appendChild(hop);
    }

    const giamChuyenDong = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function khoiDong() {
      if (boDem) clearInterval(boDem);
      const ms = (typeof SLIDE_NEN_CAI_DAT !== 'undefined' && SLIDE_NEN_CAI_DAT.thoiGian) || 0;
      if (cacSlide.length > 1 && ms > 0 && !giamChuyenDong) {
        boDem = setInterval(function () { hien(viTri + 1); }, ms);
      }
    }

    hien(0);
    khoiDong();
  });
})();
