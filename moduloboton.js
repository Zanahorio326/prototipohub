(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // con panel avanzado de selección de color, degradado, dirección y contorno.

  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  let countToggle = 0;     // para 💠/↘️
  let countAlternate = 0;  // para 🎨/🖌️

  window.addEventListener('toggleMode', () => {
    countToggle++;
    countAlternate = 0;
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  });
  window.addEventListener('alternateAction', () => {
    countAlternate++;
    countToggle = 0;
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  });

  function getCurrentIcon() {
    if (countAlternate === 0) {
      return (countToggle % 2 === 0) ? '💠' : '↘️';
    } else {
      return (countAlternate % 2 === 1) ? '🎨' : '🖌️';
    }
  }

  function openColorPanel(block, innerBtn) {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute', top: block.offsetTop + 'px',
      left: (block.offsetLeft + block.offsetWidth + 10) + 'px',
      padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: '8px'
    });

    const color1 = document.createElement('input'); color1.type = 'color'; color1.value = '#007bff'; panel.appendChild(color1);
    const gradientToggle = document.createElement('button'); gradientToggle.textContent = 'Degradé'; gradientToggle.style.cursor = 'pointer'; panel.appendChild(gradientToggle);
    const color2 = document.createElement('input'); color2.type = 'color'; color2.value = '#ff4081'; color2.style.display = 'none'; panel.appendChild(color2);

    const dirContainer = document.createElement('div'); dirContainer.style.display = 'none'; dirContainer.style.gap = '6px'; ['↕️','↔️','⭕'].forEach(e=>{const b=document.createElement('button');b.textContent=e;b.style.opacity='0.5';b.style.cursor='pointer';b.addEventListener('click',()=>{dirContainer.querySelectorAll('button').forEach(x=>x.style.opacity='0.5');b.style.opacity='1';updateBg();});dirContainer.appendChild(b);}); dirContainer.children[0].style.opacity='1'; panel.appendChild(dirContainer);

    function updateBg() {
      const c1=color1.value;
      if (!gradientToggle.classList.contains('active')) { innerBtn.style.background=c1; return; }
      const c2=color2.value; const sel=[...dirContainer.children].find(b=>b.style.opacity==='1').textContent;
      let css; if(sel==='↕️')css=`linear-gradient(${c1},${c2})`;else if(sel==='↔️')css=`linear-gradient(90deg,${c1},${c2})`;else css=`radial-gradient(circle,${c1},${c2})`;
      innerBtn.style.background=css;
    }
    color1.addEventListener('input',updateBg); color2.addEventListener('input',updateBg);
    gradientToggle.addEventListener('click',()=>{const a=gradientToggle.classList.toggle('active');color2.style.display=a?'block':'none';dirContainer.style.display=a?'flex':'none';updateBg();});

    document.body.appendChild(panel);
    document.addEventListener('mousedown',function f(e){if(!panel.contains(e.target)){panel.remove();document.removeEventListener('mousedown',f);}});
  }

  function openOutlinePanel(block, innerBtn) {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute', top: block.offsetTop + 'px',
      left: (block.offsetLeft + block.offsetWidth + 10) + 'px',
      padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: '8px'
    });

    const color1 = document.createElement('input'); color1.type='color'; color1.value='#0056b3'; panel.appendChild(color1);
    const gradientToggle = document.createElement('button'); gradientToggle.textContent='Degradé'; gradientToggle.style.cursor='pointer'; panel.appendChild(gradientToggle);
    const color2 = document.createElement('input'); color2.type='color'; color2.value='#003f7f'; color2.style.display='none'; panel.appendChild(color2);

    const dirContainer = document.createElement('div'); dirContainer.style.display='none'; dirContainer.style.gap='6px'; ['↕️','↔️'].forEach(e=>{const b=document.createElement('button');b.textContent=e;b.style.opacity='0.5';b.style.cursor='pointer';b.addEventListener('click',()=>{dirContainer.querySelectorAll('button').forEach(x=>x.style.opacity='0.5');b.style.opacity='1';updateOutline();});dirContainer.appendChild(b);}); dirContainer.children[0].style.opacity='1'; panel.appendChild(dirContainer);

    function updateOutline() {
      const c1=color1.value;
      if(!gradientToggle.classList.contains('active')){innerBtn.style.borderColor=c1;return;}      
      const c2=color2.value; const sel=[...dirContainer.children].find(b=>b.style.opacity==='1').textContent;
      let css;
      if(sel==='↕️') css=`linear-gradient(${c1},${c2})`;
      else css=`linear-gradient(90deg,${c1},${c2})`;
      innerBtn.style.borderImage=`${css} 1`; innerBtn.style.borderWidth='2px'; innerBtn.style.borderStyle='solid';
    }
    color1.addEventListener('input',updateOutline); color2.addEventListener('input',updateOutline);
    gradientToggle.addEventListener('click',()=>{const a=gradientToggle.classList.toggle('active');color2.style.display=a?'block':'none';dirContainer.style.display=a?'flex':'none';updateOutline();});

    document.body.appendChild(panel);
    document.addEventListener('mousedown',function f(e){if(!panel.contains(e.target)){panel.remove();document.removeEventListener('mousedown',f);}});
  }

  btn.addEventListener('click',()=>{
    const canvas=document.getElementById('canvas'); if(!canvas)return;
    const margin=10;
    const innerBtn=document.createElement('button'); innerBtn.textContent='Botón'; Object.assign(innerBtn.style,{cursor:'pointer',padding:'8px 16px',boxSizing:'border-box',background:'#007bff',color:'#fff',border:'none',borderRadius:'4px'}); innerBtn.addEventListener('click',e=>e.stopPropagation());
    const block=document.createElement('div'); Object.assign(block.style,{position:'absolute',left:'50px',top:'50px',padding:margin+'px',background:'transparent',border:'1px solid #aaa',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',boxSizing:'border-box'}); block.appendChild(innerBtn); canvas.appendChild(block);
    const rect=innerBtn.getBoundingClientRect(); block.style.width=rect.width+margin*2+'px'; block.style.height=rect.height+margin*2+'px';
    const handleSize=24; const handle=document.createElement('div'); handle.classList.add('block-handle'); Object.assign(handle.style,{position:'absolute',width:handleSize+'px',height:handleSize+'px',bottom:-(handleSize/2)+'px',right:-(handleSize/2)+'px',borderRadius:'50%',background:'#fff',border:'1px solid #0056b3',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',userSelect:'none',fontSize:'14px',boxSizing:'border-box'});
    handle.textContent=getCurrentIcon(); block.appendChild(handle);
    let dragging=false,startX,startY,origX,origY,origW,origH;
    handle.addEventListener('mousedown',e=>{
      const icon=getCurrentIcon();
      if(icon==='🎨'){openColorPanel(block,innerBtn);return;} 
      if(icon==='🖌️'){openOutlinePanel(block,innerBtn);return;}
      if(icon==='💠'||icon==='↘️'){
        dragging=true; startX=e.clientX; startY=e.clientY; origX=block.offsetLeft; origY=block.offsetTop; origW=block.offsetWidth; origH=block.offsetHeight; handle.style.cursor='grabbing'; e.stopPropagation(); e.preventDefault();
      }
    });
    document.addEventListener('mousemove',e=>{if(!dragging)return; const dx=e.clientX-startX,dy=e.clientY-startY; const icon=getCurrentIcon(); if(icon==='💠'){block.style.left=origX+dx+'px';block.style.top=origY+dy+'px';}else if(icon==='↘️'){const nw=Math.max(origW+dx,margin*2+20),nh=Math.max(origH+dy,margin*2+20);block.style.width=nw+'px';block.style.height=nh+'px';innerBtn.style.width=nw-margin*2+'px';innerBtn.style.height=nh-margin*2+'px';}});
    document.addEventListener('mouseup',()=>{if(dragging){dragging=false;handle.style.cursor='pointer';}});
    handle.addEventListener('touchstart',e=>{const t=e.touches[0];const icon=getCurrentIcon();if(icon==='🎨'){openColorPanel(block,innerBtn);return;}if(icon==='🖌️'){openOutlinePanel(block,innerBtn);return;}if(icon==='💠'||icon==='↘️'){dragging=true;startX=t.clientX;startY=t.clientY;origX=block.offsetLeft;origY=block.offsetTop;origW=block.offsetWidth;origH=block.offsetHeight;}e.preventDefault();},{passive:false});
    document.addEventListener('touchmove',e=>{if(!dragging)return;const t=e.touches[0];document.dispatchEvent(new MouseEvent('mousemove',{clientX:t.clientX,clientY:t.clientY}));e.preventDefault();},{passive:false});
    document.addEventListener('touchend',()=>{if(dragging){dragging=false;handle.style.cursor='pointer';}});
  });
})();