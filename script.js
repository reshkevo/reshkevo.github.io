(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return document.querySelectorAll(s)};
// progress + navbar + back-top
var pb=$('#progress-bar'),nb=$('#navbar'),bt=$('#backTop');
window.addEventListener('scroll',function(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  if(pb&&h>0)pb.style.width=(window.scrollY/h*100)+'%';
  if(nb)nb.classList.toggle('scrolled',window.scrollY>60);
  if(bt)bt.classList.toggle('show',window.scrollY>300);
},{passive:true});
if(bt)bt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
// mobile menu
var ham=$('#hamburger'),mm=$('#mobileMenu');
function closeMenu(){if(!mm)return;mm.classList.remove('open');ham.classList.remove('open');ham.setAttribute('aria-expanded','false')}
if(ham&&mm){
  ham.addEventListener('click',function(){var o=mm.classList.toggle('open');ham.classList.toggle('open',o);ham.setAttribute('aria-expanded',o)});
  mm.addEventListener('click',function(e){if(e.target.tagName==='A')closeMenu()});
  document.addEventListener('click',function(e){if(mm.classList.contains('open')&&!mm.contains(e.target)&&!ham.contains(e.target))closeMenu()});
}
// reveal
var rv=$$('.reveal');
if('IntersectionObserver' in window){
  var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target)}})},{threshold:.06});
  rv.forEach(function(el){ro.observe(el)});
}else{rv.forEach(function(el){el.classList.add('visible')})}
// typewriter
var tw=$('#tw-text');
if(tw){
  var ph=['Risk management first','Free forex lessons','Position sizing made simple','Live market breakdowns','Practice with $10,000 virtual funds'],pi=0,ci=0,del=false;
  (function type(){
    var cur=ph[pi];
    if(!del){tw.textContent=cur.slice(0,++ci);if(ci===cur.length){del=true;return setTimeout(type,1800)}}
    else{tw.textContent=cur.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%ph.length}}
    setTimeout(type,del?45:80);
  })();
}
// counters
var sb=$('.stats-bar');
if(sb&&'IntersectionObserver' in window){
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    $$('.stat-num').forEach(function(el){var t=parseInt(el.dataset.target,10),c=0,st=Math.max(1,t/30);var id=setInterval(function(){c=Math.min(c+st,t);el.textContent=Math.round(c)+'+';if(c>=t)clearInterval(id)},40)});
    so.disconnect()}})},{threshold:.5});
  so.observe(sb);
}
// marquee
var m=$('#marquee');
if(m){var p=['EUR/USD','GBP/USD','USD/JPY','USD/CHF','AUD/USD','USD/CAD','NZD/USD','XAU/USD','EUR/GBP','GBP/JPY'],h='';for(var i=0;i<2;i++)p.forEach(function(x){h+='<span>'+x+'</span>'});m.innerHTML=h}
// year
var y=$('#year');if(y)y.textContent=new Date().getFullYear();
// calculator
var btn=$('#calcBtn');
if(btn){
  btn.addEventListener('click',function(){
    var B=parseFloat($('#balance').value),R=parseFloat($('#riskPct').value),S=parseFloat($('#stopPips').value),V=parseFloat($('#pairType').value);
    if(!(B>0&&R>0&&S>0)){$('#resDollar').textContent='Fill all fields';$('#resLots').textContent='—';$('#resUnits').textContent='—';return}
    var d=B*R/100,l=d/(S*V),u=Math.round(l*100000);
    $('#resDollar').textContent='$'+d.toFixed(2);
    $('#resLots').textContent=l.toFixed(2)+' lots';
    $('#resUnits').textContent=u.toLocaleString()+' units ('+(l*100).toFixed(1)+' micro)';
  });
}
// search page
var sf=$('#searchInput');
if(sf&&window.SITE_INDEX){
  var out=$('#searchResults');
  function run(q){
    q=q.trim().toLowerCase();
    if(!q){out.innerHTML='<p class="sec-lead">Type something like <b>stop-loss</b>, <b>leverage</b> or <b>exness</b>.</p>';return}
    var terms=q.split(/\s+/),res=window.SITE_INDEX.map(function(it){
      var hay=(it.t+' '+it.d+' '+it.k).toLowerCase(),sc=0;
      terms.forEach(function(t){if(it.t.toLowerCase().indexOf(t)>-1)sc+=3;if(hay.indexOf(t)>-1)sc+=1});
      return {it:it,sc:sc};
    }).filter(function(r){return r.sc>0}).sort(function(a,b){return b.sc-a.sc});
    if(!res.length){out.innerHTML='<p class="sec-lead">No results for “'+q.replace(/</g,'&lt;')+'”. Try a simpler word.</p>';return}
    out.innerHTML='<div class="grid g3">'+res.map(function(r){var i=r.it;return '<a class="card" href="'+i.u+'"><div class="card-body"><div class="card-cat">'+i.c+'</div><h3>'+i.t+'</h3><p>'+i.d+'</p><span class="read-more">Read More</span></div></a>'}).join('')+'</div>';
  }
  sf.addEventListener('input',function(){run(sf.value)});
  $('#searchForm').addEventListener('submit',function(e){e.preventDefault();run(sf.value)});
  var qs=new URLSearchParams(location.search).get('q');if(qs){sf.value=qs;run(qs)}else run('');
}
})();
