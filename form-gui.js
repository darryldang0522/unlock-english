/* =========================================================
   GỬI FORM ĐĂNG KÝ VỀ GOOGLE SHEETS
   Chỉ cần sửa 1 dòng bên dưới: dán link "Web app" của Apps Script vào.
   ========================================================= */
const LINK_NHAN_FORM = 'https://script.google.com/macros/s/AKfycbzjyZcxehgjXaL68l8kBMlarPrzEyHVSq95Xj0GZ7knyJvTtL2cuNRo3gW0pGseE0RftA/exec';

document.querySelectorAll('form.form').forEach((form) => {
  const nut = form.querySelector('button[type="submit"]');
  const chuGoc = nut ? nut.textContent : 'Gửi thông tin';

  // Ô ẩn chống spam: người thật không thấy nên không điền, máy tự động thì có
  const bay = document.createElement('input');
  bay.type = 'text';
  bay.name = 'website';
  bay.tabIndex = -1;
  bay.autocomplete = 'off';
  bay.setAttribute('aria-hidden', 'true');
  bay.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
  form.appendChild(bay);

  // Dòng thông báo kết quả
  const tb = document.createElement('p');
  tb.setAttribute('aria-live', 'polite');
  tb.style.cssText = 'margin-top:12px;font-weight:600;font-size:0.95rem;text-align:center;';
  form.appendChild(tb);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (LINK_NHAN_FORM.indexOf('http') !== 0) {
      tb.style.color = '#B33030';
      tb.textContent = 'Form chưa được kết nối. Vui lòng liên hệ trực tiếp qua Zalo/điện thoại.';
      return;
    }

    const du = new URLSearchParams(new FormData(form));
    du.append('trang', document.title);          // biết khách gửi từ trang nào

    nut.disabled = true;
    nut.textContent = 'Đang gửi...';
    tb.textContent = '';

    try {
      await fetch(LINK_NHAN_FORM, { method: 'POST', body: du, mode: 'no-cors' });
      form.reset();
      tb.style.color = '#1F7A45';
      tb.textContent = 'Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.';
    } catch (loi) {
      tb.style.color = '#B33030';
      tb.textContent = 'Gửi chưa được. Bạn thử lại hoặc nhắn Zalo giúp chúng tôi nhé.';
    }

    nut.disabled = false;
    nut.textContent = chuGoc;
  });
});
