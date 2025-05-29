(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // con panel avanzado de selección de fondo y contorno del botón interno con degradé que respeta border-radius.

  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  let countToggle = 0, countAlternate = 0;
  window.addEventListener('toggleMode', () => {
    countToggle++; countAlternate = 0;
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  });
  window.addEventListener('alternateAction', () => {
    countAlternate++; countToggle = 0;
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  });

  function getCurrentIcon() {
    if (countAlternate === 0) return (countToggle % 2 === 0) ? '💠' : '↘️';
    return (countAlternate % 2 === 1) ? '🎨' : '🖌️';
  }

  function openOutlinePanel(block, innerBtn) {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute', top: block.offsetTop + 'px',
      left: block.offsetLeft + block.offsetWidth + 10 + 'px',
      padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: '8px'
    });

    const enableOutline = document.createElement('label');
    const cb = document.createElement('input'); cb.type = 'checkbox'; enableOutline.append(cb, document.createTextNode(' Contorno'));
    enableOutline.style.cursor = 'pointer'; panel.appendChild(enableOutline);

    const shapeContainer = document.createElement('div'); Object.assign(shapeContainer.style, { display: 'none', gap: '6px' });
    ['◻️','🔲','⚫'].forEach(e => {
      const b = document.createElement('button'); b.textContent = e;
      Object.assign(b.style, { cursor: 'pointer', opacity: '0.5' });
      b.addEventListener('click', () => { shapeContainer.querySelectorAll('button').forEach(x => x.style.opacity = '0.5'); b.style.opacity = '1'; applyOutline(); });
      shapeContainer.appendChild(b);
    }); shapeContainer.children[0].style.opacity = '1'; panel.appendChild(shapeContainer);

    const color1 = document.createElement('input'); color1.type = 'color'; color1.value = '#0056b3'; color1.style.display = 'none'; panel.appendChild(color1);
    const gradientToggle = document.createElement('button'); gradientToggle.textContent = 'Degradé'; gradientToggle.style.cursor = 'pointer'; gradientToggle.style.display = 'none'; panel.appendChild(gradientToggle);
    const color2 = document.createElement('input'); color2.type = 'color'; color2.value = '#003f7f'; color2.style.display = 'none'; panel.appendChild(color2);
    const dirContainer = document.createElement('div'); Object.assign(dirContainer.style, { display: 'none', gap: '6px' });
    ['↕️','↔️'].forEach(e => {
      const b = document.createElement('button'); b.textContent = e;
      Object.assign(b.style, { cursor: 'pointer', opacity: '0.5' });
      b.addEventListener('click', () => { dirContainer.querySelectorAll('button').forEach(x => x.style.opacity = '0.5'); b.style.opacity = '1'; applyOutline(); });
      dirContainer.appendChild(b);
    }); dirContainer.children[0].style.opacity = '1'; panel.appendChild(dirContainer);

    function applyOutline() {
      if (!cb.checked) { innerBtn.style.border = 'none'; innerBtn.style.backgroundClip=''; innerBtn.style.backgroundImage=''; return; }
      // border-radius always
      const shape = [...shapeContainer.children].find(b => b.style.opacity==='1').textContent;
      const radius = shape==='◻️' ? '0' : shape==='🔲' ? '4px' : '50%';
      innerBtn.style.borderRadius = radius;

      if (!gradientToggle.classList.contains('active')) {
        innerBtn.style.border = `2px solid ${color1.value}`;
        innerBtn.style.backgroundClip=''; innerBtn.style.backgroundImage='';
      } else {
        // use background-image for gradient border respecting radius
        const c1 = color1.value, c2 = color2.value;
        const sel = [...dirContainer.children].find(b=>b.style.opacity==='1').textContent;
        let grad;
        if(sel==='↕️') grad=`linear-gradient(${c1},${c2})`;
        else grad=`linear-gradient(90deg,${c1},${c2})`;
        innerBtn.style.border = '2px solid transparent';
        innerBtn.style.backgroundImage = `${grad}, ${innerBtn.style.background || '#007bff'}`;
        innerBtn.style.backgroundOrigin = 'border-box, padding-box';
        innerBtn.style.backgroundClip = 'border-box, padding-box';
      }
    }

    cb.addEventListener('change', () => {
      const a = cb.checked;
      shapeContainer.style.display   = a?'flex':'none';
      color1.style.display           = a?'block':'none';
      gradientToggle.style.display   = a?'block':'none';
      dirContainer.style.display     = a?'flex':'none';
      color2.style.display           = 'none'; gradientToggle.classList.remove('active');
      applyOutline();
    });
    color1.addEventListener('input',applyOutline);
    color2.addEventListener('input',applyOutline);
    gradientToggle.addEventListener('click',()=>{
      const a=gradientToggle.classList.toggle('active');
      color2.style.display = a?'block':'none';
      dirContainer.style.display = a?'flex':'none';
      applyOutline();
    });

    document.body.appendChild(panel);
    document.addEventListener('mousedown', function f(e){ if(!panel.contains(e.target)){ panel.remove(); document.removeEventListener('mousedown',f);} });
  }

  btn.addEventListener('click',()=>{
    const canvas=document.getElementById('canvas'); if(!canvas) return;
    const margin=10;
    const innerBtn=document.createElement('button'); innerBtn.textContent='Botón'; Object.assign(innerBtn.style,{cursor:'pointer',padding:'8px 16px',boxSizing:'border-box',background:'#007bff',color:'#fff',border:'none',borderRadius:'4px'});
    innerBtn.addEventListener('click',e=>e.stopPropagation());

    const block=document.createElement('div'); Object.assign(block.style,{position:'absolute',left:'50px',top:'50px',padding:margin+'px',background:'transparent',border:'1px solid #aaa',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',boxSizing:'border-box'});
    block.appendChild(innerBtn); canvas.appendChild(block);
    const rect=innerBtn.getBoundingClientRect(); block.style.width=rect.width+margin*2+'px'; block.style.height=rect.height+margin*2+'px';

    const handle=document.createElement('div'); const hs=24; handle.classList.add('block-handle'); Object.assign(handle.style,{position:'absolute',width:hs+'px',height:hs+'px',bottom:-(hs/2)+'px',right:-(hs/2)+'px',borderRadius:'50%',background:'#fff',border:'1px solid #0056b3',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',userSelect:'none',fontSize:'14px',boxSizing:'border-box'});
    handle.textContent=getCurrentIcon(); block.appendChild(handle);
    let drag=false,sx,sy,ox,oy,ow,oh;
    handle.addEventListener('mousedown',e=>{const icon=getCurrentIcon(); if(icon==='🎨'){openColorPanel(block,innerBtn);return;} if(icon==='🖌️'){openOutlinePanel(block,innerBtn);return;} if(icon==='💠'||icon==='↘️'){drag=true; sx=e.clientX;sy=e.clientY;ox=block.offsetLeft;oy=block.offsetTop;ow=block.offsetWidth;oh=block.offsetHeight;handle.style.cursor='grabbing';e.stopPropagation();e.preventDefault();}});
    document.addEventListener('mousemove',e=>{if(!drag)return;const dx=e.clientX-sx,dy=e.clientY-sy;const icon=getCurrentIcon(); if(icon==='💠'){block.style.left=ox+dx+'px';block.style.top=oy+dy+'px';}else{const nw=Math.max(ow+dx,margin*2+20),nh=Math.max(oh+dy,margin*2+20);block.style.width=nw+'px';block.style.height=nh+'px';innerBtn.style.width=nw-margin*2+'px';innerBtn.style.height=nh-margin*2+'px';}});
    document.addEventListener('mouseup',()=>{if(drag){drag=false;handle.style.cursor='pointer';}});
    handle.addEventListener('touchstart',e=>{const t=e.touches[0],icon=getCurrentIcon();if(icon==='🎨'){openColorPanel(block,innerBtn);return;}if(icon==='🖌️'){openOutlinePanel(block,innerBtn);return;}if(icon==='💠'||icon==='↘️'){drag=true;sx=t.clientX;sy=t.clientY;ox=block.offsetLeft;oy=block.offsetTop;ow=block.offsetWidth;oh=block.offsetHeight;}e.preventDefault();},{passive:false});
    document.addEventListener('touchmove',e=>{if(!drag)return;const t=e.touches[0];document.dispatchEvent(new MouseEvent('mousemove',{clientX:t.clientX,clientY:t.clientY}));e.preventDefault();},{passive:false});
    document.addEventListener('touchend',()=>{if(drag){drag=false;handle.style.cursor='pointer';}});
  });
})();