/* =========================================================
   HIỆU ỨNG KHI CUỘN TRANG
   ========================================================= */

/* ---------- 1. Hiện dần từng phần khi cuộn tới ---------- */

// Danh sách các phần tử sẽ có hiệu ứng, kèm kiểu hiệu ứng
// Muốn thêm hiệu ứng cho phần khác: thêm một dòng { selector, kieu }
const hieuUng = [
  { selector: '.hero__text > *',     kieu: 'reveal--up' },
  { selector: '.section__head',      kieu: 'reveal--up' },
  { selector: '.card',               kieu: 'reveal--up' },
  { selector: '.feature',            kieu: 'reveal--zoom' },
  { selector: '.step',               kieu: 'reveal--up' },
  { selector: '.quote',              kieu: 'reveal--up' },
  { selector: '.certs',              kieu: 'reveal--up' },
  { selector: '.study__col--det',    kieu: 'reveal--left' },
  { selector: '.study__col--toeic',  kieu: 'reveal--right' },
  { selector: '.flip',               kieu: 'reveal--zoom' },
  { selector: '.page-hero__text > *',kieu: 'reveal--up' },
  { selector: '.out',                kieu: 'reveal--up' },
  { selector: '.curr',               kieu: 'reveal--up' },
  { selector: '.price',              kieu: 'reveal--zoom' },
  { selector: '.mini',               kieu: 'reveal--up' },
  { selector: '.story__text',        kieu: 'reveal--left' },
  { selector: '.story__box',         kieu: 'reveal--right' },
  { selector: '.person',             kieu: 'reveal--up' },
  { selector: '.info',               kieu: 'reveal--left' },
  { selector: '.map',                kieu: 'reveal--up' },
  { selector: '.faq',                kieu: 'reveal--left' },
  { selector: '.cta__text',          kieu: 'reveal--left' },
  { selector: '.form',               kieu: 'reveal--right' },
];

const phanTuCanTheoDoi = [];

hieuUng.forEach(({ selector, kieu }) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add('reveal', kieu);

    // Các phần tử anh em cùng cha sẽ hiện lần lượt, cách nhau 0.12 giây
    const anhEm = Array.from(el.parentElement.children)
      .filter((c) => c.classList.contains(kieu));
    const viTri = anhEm.indexOf(el);
    el.dataset.delay = (viTri * 0.12) + 's';   // lưu độ trễ để dùng mỗi lần hiện lại

    phanTuCanTheoDoi.push(el);
  });
});

// Lưu bộ đếm giờ của từng phần tử (để hủy khi phần tử rời màn hình)
const boDemGio = new Map();

// Hiện phần tử NGAY LẬP TỨC, không chạy hiệu ứng
function hienNgay(el) {
  clearTimeout(boDemGio.get(el));
  el.style.transition = 'none';
  el.style.transitionDelay = '0s';
  el.classList.add('is-visible', 'reveal-done');
  void el.offsetHeight;            // ép trình duyệt áp dụng ngay
  el.style.transition = '';        // trả lại hiệu ứng bình thường cho hover
}

// IntersectionObserver: báo khi một phần tử đi vào HOẶC rời khỏi màn hình
const quanSat = new IntersectionObserver((danhSach) => {
  danhSach.forEach((muc) => {
    const el = muc.target;
    const phiaTren = muc.boundingClientRect.top < 0;   // phần tử đang nằm phía TRÊN màn hình

    if (muc.isIntersecting) {
      // ---- Đi vào màn hình ----
      if (phiaTren && !el.classList.contains('is-visible')) {
        // Đi vào từ phía trên (đang lướt LÊN) → hiện ngay, không chạy hiệu ứng
        hienNgay(el);
      } else if (!el.classList.contains('is-visible')) {
        // Đi vào từ phía dưới (đang lướt XUỐNG) → chạy hiệu ứng, thẻ hiện lần lượt
        el.style.transitionDelay = el.dataset.delay;
        el.classList.add('is-visible');

        // Sau khi hiện xong, bỏ độ trễ để hiệu ứng rê chuột phản hồi ngay
        const gio = setTimeout(() => {
          el.style.transitionDelay = '0s';
          el.classList.add('reveal-done');
        }, 1500);
        boDemGio.set(el, gio);
      }

    } else {
      // ---- Rời khỏi màn hình ----
      if (phiaTren) {
        // Đã lướt xuống qua phần tử này → giữ nguyên trạng thái hiện
        // (nếu bị bỏ qua do cuộn nhanh thì hiện luôn, để lướt lên không bị trống)
        if (!el.classList.contains('is-visible')) hienNgay(el);
      } else {
        // Phần tử nằm phía DƯỚI (người dùng lướt lên, bỏ lại phía sau) → ẩn đi,
        // để lần lướt xuống tiếp theo sẽ chạy hiệu ứng lại
        clearTimeout(boDemGio.get(el));
        el.style.transitionDelay = '0s';
        el.classList.remove('is-visible', 'reveal-done');
      }
    }
  });
}, {
  threshold: 0.15,                     // hiện khi thấy được 15% phần tử
  rootMargin: '0px 0px -40px 0px'
});

phanTuCanTheoDoi.forEach((el) => quanSat.observe(el));


/* ---------- 2. Thanh tiến trình, đổ bóng menu, nút lên đầu ---------- */

const thanhTienTrinh = document.getElementById('progress');
const menu = document.querySelector('.header');
const nutLenDau = document.getElementById('toTop');

function khiCuon() {
  const daCuon = window.scrollY;
  const tongChieuCao = document.documentElement.scrollHeight - window.innerHeight;
  const phanTram = tongChieuCao > 0 ? (daCuon / tongChieuCao) * 100 : 0;

  thanhTienTrinh.style.width = phanTram + '%';
  menu.classList.toggle('header--scrolled', daCuon > 20);
  nutLenDau.classList.toggle('to-top--show', daCuon > 500);
}

window.addEventListener('scroll', khiCuon, { passive: true });
khiCuon();


/* ---------- 3. Tô sáng mục menu của phần đang xem ---------- */

const cacMucMenu = document.querySelectorAll('.nav a[href^="#"]:not(.btn)');
const cacPhan = Array.from(cacMucMenu)
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const quanSatMenu = new IntersectionObserver((danhSach) => {
  danhSach.forEach((muc) => {
    if (muc.isIntersecting) {
      cacMucMenu.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + muc.target.id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

cacPhan.forEach((p) => quanSatMenu.observe(p));


/* ---------- 4. Slide chứng chỉ chạy ngang liền mạch ---------- */

const dai = document.getElementById('certTrack');

if (dai) {
  const cacChungChi = Array.from(dai.children);

  // Nhân đôi toàn bộ chứng chỉ để khi chạy hết nửa dải thì quay lại liền mạch
  cacChungChi.forEach((el) => {
    const ban = el.cloneNode(true);
    ban.setAttribute('aria-hidden', 'true');   // bản sao không cần đọc lại cho người khiếm thị
    dai.appendChild(ban);
  });

  // Càng nhiều chứng chỉ thì chạy càng lâu để tốc độ giữ nguyên (5 giây/chứng chỉ)
  dai.style.setProperty('--thoi-gian', (cacChungChi.length * 5) + 's');
}


/* ---------- 5. GÓC HỌC TẬP ---------- */

// 5a. Bấm (hoặc nhấn Enter/Space) để lật thẻ từ vựng
document.querySelectorAll('.flip').forEach((the) => {
  const lat = () => the.classList.toggle('is-flipped');
  the.addEventListener('click', lat);
  the.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lat(); }
  });
});

// 5b. Câu hỏi thử sức: chọn đáp án → báo đúng/sai
document.querySelectorAll('.quiz').forEach((quiz) => {
  const cacNut = quiz.querySelectorAll('.opt');
  const loiBao = quiz.querySelector('.quiz__fb');
  const nutLamLai = quiz.querySelector('.quiz__reset');

  cacNut.forEach((nut) => {
    nut.addEventListener('click', () => {
      const dung = nut.hasAttribute('data-correct');
      cacNut.forEach((n) => { n.disabled = true; });          // khóa các đáp án

      if (dung) {
        nut.classList.add('correct');
        loiBao.textContent = quiz.querySelector('.quiz__ok').textContent;
        loiBao.className = 'quiz__fb is-ok';
      } else {
        nut.classList.add('wrong');
        quiz.querySelector('[data-correct]').classList.add('correct');  // chỉ ra đáp án đúng
        loiBao.textContent = quiz.querySelector('.quiz__no').textContent;
        loiBao.className = 'quiz__fb is-no';
      }
      nutLamLai.hidden = false;
    });
  });

  nutLamLai.addEventListener('click', () => {
    cacNut.forEach((n) => { n.disabled = false; n.classList.remove('correct', 'wrong'); });
    loiBao.textContent = '';
    loiBao.className = 'quiz__fb';
    nutLamLai.hidden = true;
  });
});

// 5c. Số chạy từ 0 lên (đếm khi lướt xuống tới, đặt lại khi lướt lên bỏ lại phía sau)
const cacSo = document.querySelectorAll('.count');
const giamChuyenDong = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function chaySo(el) {
  const dich = Number(el.dataset.target);
  const thoiGian = 1400;                 // 1,4 giây
  const batDau = performance.now();
  cancelAnimationFrame(el._raf);

  function buoc(bayGio) {
    const t = Math.min((bayGio - batDau) / thoiGian, 1);
    const muotHon = 1 - Math.pow(1 - t, 3);          // chạy nhanh rồi chậm dần
    el.textContent = Math.round(dich * muotHon);
    if (t < 1) el._raf = requestAnimationFrame(buoc);
  }
  el._raf = requestAnimationFrame(buoc);
}

if (!giamChuyenDong) {
  cacSo.forEach((el) => { el.textContent = '0'; });

  const quanSatSo = new IntersectionObserver((ds) => {
    ds.forEach((muc) => {
      const el = muc.target;
      if (muc.isIntersecting) {
        chaySo(el);
      } else if (muc.boundingClientRect.top > 0) {   // nằm phía dưới → đặt lại
        cancelAnimationFrame(el._raf);
        el.textContent = '0';
      } else {                                        // đã lướt qua phía trên → giữ số cuối
        cancelAnimationFrame(el._raf);
        el.textContent = el.dataset.target;
      }
    });
  }, { threshold: 0.6 });

  cacSo.forEach((el) => quanSatSo.observe(el));
}


/* ---------- 6. Menu điện thoại (nút 3 gạch) ---------- */

const nutMenu = document.getElementById('navToggle');
const dsMenu = document.getElementById('nav');

if (nutMenu && dsMenu) {
  function dongMo(mo) {
    dsMenu.classList.toggle('nav--open', mo);
    nutMenu.classList.toggle('is-open', mo);
    nutMenu.setAttribute('aria-expanded', String(mo));
  }
  nutMenu.addEventListener('click', () => dongMo(!dsMenu.classList.contains('nav--open')));
  // Bấm vào một mục thì đóng menu
  dsMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => dongMo(false)));
}
