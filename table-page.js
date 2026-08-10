// Shared renderer for the three money list pages (chạp / sân / họ).
// Rows are built with DOM APIs so data is always inserted as text and can
// never be interpreted as HTML.

/**
 * Fetch a money list and render it into #table-body, with the sum in #total.
 * @param {string} jsonUrl path to a JSON array of {name, time, money, notice}
 */
function renderMoneyTable(jsonUrl) {
  const tbody = document.getElementById("table-body");
  const totalEl = document.getElementById("total");

  fetch(jsonUrl)
    .then(res => {
      if (!res.ok) throw new Error(`${jsonUrl}: HTTP ${res.status}`);
      return res.json();
    })
    .then(rows => {
      const fragment = document.createDocumentFragment();
      let total = 0;

      rows.forEach((row, index) => {
        // Guard against malformed records instead of crashing the whole table
        const money = Number.isFinite(row.money) ? row.money : null;
        total += money ?? 0;

        const tr = document.createElement("tr");
        appendCell(tr, String(index + 1));
        appendCell(tr, row.name);
        appendCell(tr, row.time);
        appendCell(tr, money === null ? "—" : `${money.toLocaleString('vi-VN')} đ`);
        appendCell(tr, row.notice);
        fragment.appendChild(tr);
      });

      tbody.replaceChildren(fragment);
      totalEl.textContent = total.toLocaleString('vi-VN');
    })
    .catch(err => {
      // Surface the failure instead of leaving a misleading "0 đ" on screen
      console.error("Lỗi tải dữ liệu:", err);
      totalEl.textContent = "— lỗi tải dữ liệu —";

      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "Không tải được dữ liệu. Vui lòng tải lại trang.";
      tr.appendChild(td);
      tbody.replaceChildren(tr);
    });
}

function appendCell(tr, text) {
  const td = document.createElement("td");
  td.textContent = text ?? "";
  tr.appendChild(td);
}
