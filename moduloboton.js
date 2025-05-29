(function() {
  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  let countToggle = 0, countAlternate = 0;
  window.addEventListener('toggleMode', () => { countToggle++; countAlternate = 0; document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon()); });
  window.addEventListener('alternateAction', () => { countAlternate++; countToggle = 0; document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon()); });
  function getCurrentIcon() { return countAlternate === 0 ? (countToggle % 2 === 0 ? '💠' : '↘️') : (countAlternate % 2 === 1 ? '🎨' : '🖌️'); }

  function openOutlinePanel(block, innerBtn) {
    const panel = document.createElement('div'); Object.assign(panel.style,{position:'absolute',top:block.offsetTop+'px',left:block.offsetLeft+block.offsetWidth+10+'px',padding:'10px',background:'#fff',border:'1px solid #ccc',borderRadius:'4px',boxShadow:'0 2px 6px rgba(0,0,0,0.2)',zIndex:1000,display:'flex',flexDirection:'column',gap:'8px'});
    const label = document.createElement('label'); label.style.cursor='pointer'; const cb=document.createElement('input'); cb.type='checkbox'; label.append(cb,document.createTextNode(' Contorno')); panel.append(label);
    const shapeDiv=document.createElement('div'); Object.assign(shapeDiv.style,{display:'none',gap:'6px'});
    ['◻️','🔲','⚫'].forEach(s=>{const b=document.createElement('button');b.textContent=s;Object.assign(b.style,{cursor:'pointer',opacity:'0.5'});b.addEventListener('click',()=>{shapeDiv.querySelectorAll('button').forEach(x=>x.style.opacity='0.5');b.style.opacity='1';apply();});shapeDiv.append(b);});shapeDiv.children[0].style.opacity='1';panel.append(shapeDiv);
    const c1=document.createElement('input');c1.type='color';c1.value='#0056b3';c1.style.display='none';panel.append(c1);
    const grdTog=document.createElement('button');grdTog.textContent='Degradé';grdTog.style.cursor='pointer';grdTog.style.display='none';panel.append(grdTog);
    const c2=document.createElement('input');c2.type='color';c2.value='#003f7f';c2.style.display='none';panel.append(c2);
    const dirDiv=document.createElement('div');Object.assign(dirDiv.style,{display:'none',gap:'6px'});
    ['↕️','↔️'].forEach(d=>{const b=document.createElement('button');b.textContent=d;Object.assign(b.style,{cursor:'pointer',opacity:'0.5'});b.addEventListener('click',()=>{dirDiv.querySelectorAll('button').forEach(x=>x.style.opacity='0.5');b.style.opacity='1';apply();});dirDiv.append(b);});dirDiv.children[0].style.opacity='1';panel.append(dirDiv);
    function apply(){
      if(!cb.checked){innerBtn.style.border='none';innerBtn.style.backgroundImage='';return;}
      const shape=Array.from(shapeDiv.children).find(b=>b.style.opacity==='1').textContent;
      const r=shape==='◻️'?'0':shape==='🔲'?'4px':'50%';innerBtn.style.borderRadius=r;
      if(!grdTog.classList.contains('active')){
        innerBtn.style.border=`2px solid ${c1.value}`;
        innerBtn.style.backgroundImage='';
      } else {
        const col1=c1.value, col2=c2.value;
        const sel=Array.from(dirDiv.children).find(b=>b.style.opacity==='1').textContent;
        const grad= sel==='↕️'?`linear-gradient(${col1},${col2})`:`linear-gradient(90deg,${col1},${col2})`;
        innerBtn.style.border='2px solid transparent';
        innerBtn.style.backgroundImage=`${grad}, ${innerBtn.style.background || '#007bff'}`;
        innerBtn.style.backgroundClip='border-box, padding-box';
        innerBtn.style.backgroundOrigin='border-box, padding-box';
      }
    }
    cb.addEventListener('change',()=>{const a=cb.checked;shapeDiv.style.display=a?'flex':'none';c1.style.display=a?'block':'none';grdTog.style.display=a?'block':'none';dirDiv.style.display=a?'flex':'none';c2.style.display='none';grdTog.classList.remove('active');apply();});
    c1.addEventListener('input',apply);c2.addEventListener('input',apply);
    grdTog.addEventListener('click',()=>{const a=grdTog.classList.toggle('active');c2.style.display=a?'block':'none';dirDiv.style.display=a?'flex':'none';apply();});
    document.body.append(panel);document.addEventListener('mousedown',function f(e){if(!panel.contains(e.target)){panel.remove();document.removeEventListener('mousedown',f);}});
  }

  btn.addEventListener('click',()=>{const canvas=document.getElementById('canvas');if(!canvas)return;const m=10;const ib=document.createElement('button');ib.textContent='Botón';Object.assign(ib.style,{cursor:'pointer',padding:'8px 16px',boxSizing:'border-box',background:'#007bff',color:'#fff',border:'none',borderRadius:'4px'});ib.addEventListener('click',e=>e.stopPropagation());const blk=document.createElement('div');Object.assign(blk.style,{position:'absolute',left:'50px',top:'50px',padding:m+'px',background:'transparent',border:'1px solid #aaa',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',boxSizing:'border-box'});blk.append(ib);canvas.append(blk);const r=ib.getBoundingClientRect();blk.style.width=r.width+ m*2+'px';blk.style.height=r.height+ m*2+'px';const h=document.createElement('div');const s=24;h.classList.add('block-handle');Object.assign(h.style,{position:'absolute',width:s+'px',height:s+'px',bottom:-(s/2)+'px',right:-(s/2)+'px',borderRadius:'50%',background:'#fff',border:'1px solid #0056b3',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',userSelect:'none',fontSize:'14px',boxSizing:'border-box'});h.textContent=getCurrentIcon();blk.append(h);let d=false, startX, startY, oX, oY, oW, oH;h.addEventListener('mousedown',e=>{const ic=getCurrentIcon();if(ic==='🎨'){openOutlinePanel(blk,ib);return;}if(ic==='🖌️'){openOutlinePanel(blk,ib);return;}if(ic==='💠'||ic==='↘️'){d=true;startX=e.clientX;startY=e.clientY;oX=blk.offsetLeft;oY=blk.offsetTop;oW=blk.offsetWidth;oH=blk.offsetHeight;h.style.cursor='grabbing';e.stopPropagation();e.preventDefault();}});document.addEventListener('mousemove',e=>{if(!d)return;const dx=e.clientX-startX,dy=e.clientY-startY;const ic=getCurrentIcon();if(ic==='💠'){blk.style.left=oX+dx+'px';blk.style.top=oY+dy+'px';}else{const nw=Math.max(oW+dx,m*2+20),nh=Math.max(oH+dy,m*2+20);blk.style.width=nw+'px';blk.style.height=nh+'px';ib.style.width=nw-m*2+'px';ib.style.height=nh-m*2+'px';}});document.addEventListener('mouseup',()=>{if(d){d=false;h.style.cursor='pointer';}});h.addEventListener('touchstart',e=>{const t=e.touches[0],ic=getCurrentIcon();if(ic==='🎨'){openOutlinePanel(blk,ib);return;}if(ic==='🖌️'){openOutlinePanel(blk,ib);return;}if(ic==='💠'||ic==='↘️'){d=true;startX=t.clientX;startY=t.clientY;oX=blk.offsetLeft;oY=blk.offsetTop;oW=blk.offsetWidth;oH=blk.offsetHeight;}e.preventDefault();},{passive:false});document.addEventListener('touchmove',e=>{if(!d)return;const t=e.touches[0];document.dispatchEvent(new MouseEvent('mousemove',{clientX:t.clientX,clientY:t.clientY}));e.preventDefault();},{passive:false});document.addEventListener('touchend',()=>{if(d){d=false;h.style.cursor='pointer';}});});})();