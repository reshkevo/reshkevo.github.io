// ===================================================================
// RESHKEVO FX — site scripts
// ===================================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Mobile nav ---------- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') navLinks.classList.remove('open');
});

/* ---------- Hero candlestick canvas (decorative, illustrative only) ---------- */
(function candlesticks(){
  const canvas = document.getElementById('candleCanvas');
  const ctx = canvas.getContext('2d');
  let width, height, candles = [];

  function resize(){
    width = canvas.width = canvas.offsetWidth * devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const count = Math.floor(canvas.offsetWidth / 26);
    candles = [];
    let base = height * 0.55;
    for (let i = 0; i < count; i++){
      const bodyH = (Math.random() * 0.18 + 0.04) * height;
      const wickH = bodyH + Math.random() * 0.12 * height;
      const up = Math.random() > 0.45;
      base += (Math.random() - 0.5) * height * 0.05;
      base = Math.max(height * 0.25, Math.min(height * 0.75, base));
      candles.push({ x: i * 26 * devicePixelRatio, base, bodyH, wickH, up, phase: Math.random() * Math.PI * 2 });
    }
  }

  function draw(t){
    ctx.clearRect(0, 0, width, height);
    candles.forEach((c) => {
      const bob = Math.sin(t / 1800 + c.phase) * 4 * devicePixelRatio;
      const y = c.base + bob;
      const color = c.up ? '#1FCB8C' : '#FF5C6C';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.55;
      // wick
      ctx.lineWidth = 1.4 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(c.x + 10 * devicePixelRatio, y - c.wickH / 2);
      ctx.lineTo(c.x + 10 * devicePixelRatio, y + c.wickH / 2);
      ctx.stroke();
      // body
      ctx.globalAlpha = 0.85;
      ctx.fillRect(c.x + 4 * devicePixelRatio, y - c.bodyH / 2, 12 * devicePixelRatio, c.bodyH);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ---------- Marquee (ambient, illustrative sample view — not live data) ---------- */
(function marquee(){
  const pairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD',
    'USD/CAD', 'NZD/USD', 'EUR/GBP', 'GBP/JPY', 'EUR/JPY'
  ];
  const el = document.getElementById('marquee');
  const items = pairs.map((p) => {
    const up = Math.random() > 0.5;
    const val = (Math.random() * 1.4 + 0.6).toFixed(4);
    return `<span class="${up ? 'up' : 'down'}"><b>${p}</b> ${val} ${up ? '&#9650;' : '&#9660;'}</span>`;
  });
  // duplicate for seamless loop
  el.innerHTML = items.join('') + items.join('');
})();

/* ---------- Risk / position size calculator ---------- */
(function riskCalculator(){
  const btn = document.getElementById('calcBtn');
  const balanceInput = document.getElementById('balance');
  const riskInput = document.getElementById('riskPct');
  const stopInput = document.getElementById('stopPips');
  const pairSelect = document.getElementById('pairType');

  const resDollar = document.getElementById('resDollar');
  const resLots = document.getElementById('resLots');
  const resUnits = document.getElementById('resUnits');

  function calculate(){
    const balance = parseFloat(balanceInput.value);
    const riskPct = parseFloat(riskInput.value);
    const stopPips = parseFloat(stopInput.value);
    const pipValuePerStdLot = parseFloat(pairSelect.value); // approx $ per pip per standard lot (100k units)

    if (!balance || !riskPct || !stopPips || balance <= 0 || riskPct <= 0 || stopPips <= 0){
      resDollar.textContent = '—';
      resLots.textContent = 'Enter valid numbers above';
      resUnits.textContent = '—';
      return;
    }

    const riskAmount = balance * (riskPct / 100);
    const pipValuePerPip = pipValuePerStdLot; // per standard lot
    const lots = riskAmount / (stopPips * pipValuePerPip);
    const units = lots * 100000;

    resDollar.textContent = '$' + riskAmount.toFixed(2);
    resLots.textContent = lots.toFixed(2) + ' standard lots';
    resUnits.textContent = Math.round(units).toLocaleString() + ' units';
  }

  btn.addEventListener('click', calculate);
  [balanceInput, riskInput, stopInput, pairSelect].forEach((el) => {
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculate(); });
  });
})();

/* ---------- Nav shrink/blur handled purely via CSS backdrop-filter; scroll-spy could be added later ---------- */
