async function load() {
  const res = await fetch('data/summary.json?_=' + Date.now());
  const data = await res.json();
  document.getElementById('club').textContent = data.club_name || 'Badminton';
  document.getElementById('title').textContent = (data.club_name || 'Badminton') + ' · 月度汇总';
  document.getElementById('updated').textContent = data.updated_at || '';
  document.getElementById('year').textContent = new Date().getFullYear();
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const current = (data.monthly || []).find(m => m.month === ym);
  const thisMonth = document.getElementById('this-month');
  if (current) {
    thisMonth.innerHTML = `
      <div class="kpis">
        <div class="kpi"><div class="num">${current.sessions}</div><div class="txt">场次</div></div>
        <div class="kpi"><div class="num">${current.people}</div><div class="txt">总人数</div></div>
        <div class="kpi"><div class="num">${current.total_fee}</div><div class="txt">总金额 (${data.currency||''})</div></div>
      </div>
    `;
  } else {
    thisMonth.textContent = '暂无数据';
  }
  const tbm = document.querySelector('#tbl-months tbody');
  (data.monthly || []).forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${m.month}</td><td>${m.sessions}</td><td>${m.people}</td><td>${m.total_fee}</td>`;
    tbm.appendChild(tr);
  });
  const tbp = document.querySelector('#tbl-people tbody');
  const rows = (data.lifetime_by_person || []).slice().sort((a,b)=> b.paid - a.paid);
  rows.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${p.name}</td><td>${p.sessions}</td><td>${p.paid}</td>`;
    tbp.appendChild(tr);
  });
  const q = document.getElementById('search');
  const reset = document.getElementById('btn-reset');
  function filter() {
    const v = q.value.trim().toLowerCase();
    Array.from(tbp.children).forEach(tr => {
      const name = tr.children[1].textContent.toLowerCase();
      tr.style.display = name.includes(v) ? '' : 'none';
    });
  }
  q.addEventListener('input', filter);
  reset.addEventListener('click', () => { q.value=''; filter(); });
}
load();