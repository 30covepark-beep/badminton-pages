document.addEventListener('DOMContentLoaded', async () => {
  async function fetchJSON(url) {
    const res = await fetch(url + '?_=' + Date.now()); // 防缓存
    return await res.json();
  }

  const data = await fetchJSON('data/summary.json');

  // 顶部信息
  const club = document.getElementById('club');
  const title = document.getElementById('title');
  const updated = document.getElementById('updated');
  const year = document.getElementById('year');

  club.textContent = data.club_name || 'Badminton';
  title.textContent = (data.club_name || 'Badminton') + ' · 月度汇总';
  updated.textContent = data.updated_at || '';
  year.textContent = new Date().getFullYear();

  // 本月概览
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const current = (data.monthly || []).find(m => m.month === ym);
  const thisMonth = document.getElementById('this-month');
  if (current) {
    thisMonth.innerHTML = `
      <div class="kpis">
        <div class="kpi"><div class="num">${current.sessions}</div><div class="txt">场次</div></div>
        <div class="kpi"><div class="num">${current.people}</div><div class="txt">总人数</div></div>
        <div class="kpi"><div class="num">${current.total_fee}</div><div class="txt">总金额 (${data.currency || ''})</div></div>
      </div>
    `;
  } else {
    thisMonth.textContent = '暂无数据';
  }

  // 按月表
  const tbm = document.querySelector('#tbl-months tbody');
  (data.monthly || []).forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${m.month}</td><td>${m.sessions}</td><td>${m.people}</td><td>${m.total_fee}</td>`;
    tbm.appendChild(tr);
  });

  // 个人累计表
  const tbp = document.querySelector('#tbl-people tbody');
  const rows = (data.lifetime_by_person || []).slice().sort((a, b) => b.paid - a.paid);
  rows.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i + 1}</td><td>${p.name}</td><td>${p.sessions}</td><td>${p.paid}</td>`;
    tbp.appendChild(tr);
  });

  // 搜索与重置（更稳健）
  const q = document.getElementById('search');
  const reset = document.getElementById('btn-reset');

  function showAllRows() {
    Array.from(tbp.children).forEach(tr => { tr.style.display = ''; });
  }

  function filter() {
    const v = (q.value || '').trim().toLowerCase();
    if (!v) { showAllRows(); return; }
    Array.from(tbp.children).forEach(tr => {
      const name = tr.children[1].textContent.toLowerCase();
      tr.style.display = name.includes(v) ? '' : 'none';
    });
  }

  q.addEventListener('input', filter);

  reset.addEventListener('click', (e) => {
    e.preventDefault(); // 防止按钮触发提交或跳转
    q.value = '';
    showAllRows();
    q.focus();
  });
});
