(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // con panel avanzado de selección de fondo y contorno del botón interno, incluyendo forma y degradé respetando border-radius.

  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  let countToggle = 0, countAlternate = 0;
  window.addEventListener('toggleMode', () => { countToggle++; countAlternate = 0; updateHandles(); });
  window.addEventListener('alternateAction', () => { countAlternate++; countToggle = 0; updateHandles(); });
  function getCurrentIcon() {
    return countAlternate === 0
      ? (countToggle % 2 === 0 ? '💠' : '↘️')
      : (countAlternate % 2 === 1 ? '🎨' : '🖌️');
  }
  function updateHandles() {
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  }

  function openOutlinePanel(block, innerBtn, wrapper) {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute', top: block.offsetTop + 'px',
      left: block.offsetLeft + block.offsetWidth + 10 + 'px',
      padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: '8px'
    });
    // enable checkbox
    const lbl = document.createElement('label'), cb = document.createElement('input');
    cb.type = 'checkbox'; lbl.append(cb, ' Contorno'); panel.append(lbl);
    // shape selector
    const shapeDiv = document.createElement('div'); Object.assign(shapeDiv.style, {display:'none',gap:'6px'});
    ['◻️','🔲','⚫'].forEach(icon => { const b=document.createElement('button'); b.textContent=icon; b.style.opacity='0.5'; b.onclick=()=>{ Array.from(shapeDiv.children).forEach(x=>x.style.opacity='0.5'); b.style.opacity='1'; apply(); }; shapeDiv.append(b); });
    shapeDiv.children[0].style.opacity='1'; panel.append(shapeDiv);
    // color inputs
    const c1=document.createElement('input'); c1.type='color'; c1.value='#0056b3'; c1.style.display='none'; panel.append(c1);
    const gradBtn=document.createElement('button'); gradBtn.textContent='Degradé'; gradBtn.style.display='none'; panel.append(gradBtn);
    const c2=document.createElement('input'); c2.type='color'; c2.value='#003f7f'; c2.style.display='none'; panel.append(c2);
    const dirDiv=document.createElement('div'); Object.assign(dirDiv.style,{display:'none',gap:'6px'});
    ['↕️','↔️'].forEach(d=>{ const b=document.createElement('button'); b.textContent=d; b.style.opacity='0.5'; b.onclick=()=>{ Array.from(dirDiv.children).forEach(x=>x.style.opacity='0.5'); b.style.opacity='1'; apply(); }; dirDiv.append(b); });
    dirDiv.children[0].style.opacity='1'; panel.append(dirDiv);

    function apply() {
      if(!cb.checked) { wrapper.style.background='none'; wrapper.style.padding='0'; wrapper.style.borderRadius=''; return; }
      // shape
      const shape = Array.from(shapeDiv.children).find(b=>b.style.opacity==='1').textContent;
      const radius = shape==='◻️'?'0': shape==='🔲'?'4px':'50%';
      wrapper.style.borderRadius = radius;
      // border or gradient
      if(!gradBtn.classList.contains('active')) {
        wrapper.style.background='none';
        innerBtn.style.border = `2px solid ${c1.value}`;
      } else {
        const col1=c1.value, col2=c2.value;
        const dir=Array.from(dirDiv.children).find(b=>b.style.opacity==='1').textContent;
        const angle = dir==='↕️'? 'to bottom':'to right';
        wrapper.style.background = `linear-gradient(${angle},${col1},${col2})`;
        wrapper.style.padding = '2px';
        innerBtn.style.border = 'none';
        innerBtn.style.borderRadius = 'calc(' + radius + ' - 2px)';
      }
    }

    cb.onchange = () => {
      const show = cb.checked;
      shapeDiv.style.display = show?'flex':'none';
      c1.style.display = show?'block':'none';
      gradBtn.style.display = show?'block':'none';
      dirDiv.style.display = show?'flex':'none';
      c2.style.display = 'none'; gradBtn.classList.remove('active');
      apply();
    };
    c1.oninput=c2.oninput=apply;
    gradBtn.onclick = ()=>{ const a=gradBtn.classList.toggle('active'); c2.style.display=a?'block':'none'; dirDiv.style.display=a?'flex':'none'; apply(); };

    document.body.append(panel);
    document.addEventListener('mousedown', function f(e){ if(!panel.contains(e.target)){ panel.remove(); document.removeEventListener('mousedown',f);} });
  }

  btn.addEventListener('click',()=>{
    const canvas=document.getElementById('canvas'); if(!canvas) return;
    const margin=10;
    const innerBtn=document.createElement('button'); innerBtn.textContent='Botón';
    Object.assign(innerBtn.style,{cursor:'pointer',padding:'8px 16px',background:'#007bff',color:'#fff',border:'none',borderRadius:'4px',boxSizing:'border-box'});
    innerBtn.onclick=e=>e.stopPropagation();

    const wrapper=document.createElement('div');
    Object.assign(wrapper.style,{position:'absolute',left:'50px',top:'50px',padding:'0',boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:'center'});
    wrapper.append(innerBtn); canvas.append(wrapper);
    const rect=wrapper.getBoundingClientRect(); wrapper.style.width=rect.width+'px'; wrapper.style.height=rect.height+'px';

    const handle=document.createElement('div'); const h=24;
    handle.classList.add('block-handle');
    Object.assign(handle.style,{position:'absolute',width:h+'px',height:h+'px',bottom:-(h/2)+'px',right:-(h/2)+'px',borderRadius:'50%',background:'#fff',border:'1px solid #0056b3',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',userSelect:'none',fontSize:'14px'});
    handle.textContent=getCurrentIcon(); wrapper.append(handle);

    let dragging=false,sx,sy,ox,oy,ow,oh;
    handle.onmousedown=e=>{
      const ic=getCurrentIcon();
      if(ic==='🎨'){ openColorPanel(wrapper,innerBtn); return; }
      if(ic==='🖌️'){ openOutlinePanel(wrapper,innerBtn,wrapper); return; }
      if(ic==='💠'||ic==='↘️'){ dragging=true; sx=e.clientX;sy=e.clientY;ox=wrapper.offsetLeft;oy=wrapper.offsetTop;ow=wrapper.offsetWidth;oh=wrapper.offsetHeight; handle.style.cursor='grabbing'; e.stopPropagation();e.preventDefault(); }
    };
    document.onmousemove=e=>{
      if(!dragging) return;
      const dx=e.clientX-sx,dy=e.clientY-sy,ic=getCurrentIcon();
      if(ic==='💠'){ wrapper.style.left=ox+dx+'px';wrapper.style.top=oy+dy+'px'; }
      else if(ic==='↘️'){ const nw=Math.max(ow+dx,margin*2+20), nh=Math.max(oh+dy,margin*2+20);
        wrapper.style.width=nw+'px';wrapper.style.height=nh+'px'; innerBtn.style.width=nw+'px';innerBtn.style.height=nh+'px';
      }
    };
    document.onmouseup=()=>{ if(dragging){ dragging=false; handle.style.cursor='pointer'; }};
    handle.ontouchstart=e=>{ const t=e.touches[0],ic=getCurrentIcon(); if(ic==='🎨'){ openColorPanel(wrapper,innerBtn); return;} if(ic==='🖌️'){ openOutlinePanel(wrapper,innerBtn,wrapper);return;} if(ic==='💠'||ic==='↘️'){ dragging=true; sx=t.clientX;sy=t.clientY;ox=wrapper.offsetLeft;oy=wrapper.offsetTop;ow=wrapper.offsetWidth;oh=wrapper.offsetHeight;} e.preventDefault(); };
    document.addEventListener('touchmove',e=>{ if(!dragging) return; const t=e.touches[0]; document.dispatchEvent(new MouseEvent('mousemove',{clientX:t.clientX,clientY:t.clientY})); e.preventDefault(); },{passive:false});
    document.addEventListener('touchend',()=>{ if(dragging){ dragging=false; handle.style.cursor='pointer'; }});
  });
})();
