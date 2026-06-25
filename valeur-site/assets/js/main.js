/* Valeur LP — interações */
(function(){
  "use strict";

  /* webhook de captura de leads */
  var WEBHOOK_URL = "https://webhook.navtus.com.br/webhook/4b73f5b6-34f8-44f9-b822-c595865adbb9";

  /* sticky header bg */
  var hdr = document.querySelector('.hdr');
  function onScroll(){
    if(window.scrollY > 24) hdr.classList.add('scrolled');
    else hdr.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* scroll reveal */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  /* failsafe: ensure everything is visible even if observer never fires */
  setTimeout(function(){
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight * 1.1) el.classList.add('in');
    });
  }, 1800);

  /* duplicate marquee track for seamless loop */
  document.querySelectorAll('.marquee-track').forEach(function(track){
    track.innerHTML += track.innerHTML;
  });

  /* select placeholder color */
  document.querySelectorAll('select').forEach(function(sel){
    sel.addEventListener('change', function(){
      sel.classList.toggle('filled', !!sel.value);
    });
  });

  /* form validation + fake submit */
  function wireForm(form){
    if(!form) return;
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function(f){
        var digits = f.value.replace(/\D/g,'');
        var bad = !f.value
          || (f.type==='tel' && digits.length < 8)
          || (f.name==='cnpj' && digits.length !== 14);
        f.classList.toggle('invalid', bad);
        if(bad) ok = false;
      });
      if(!ok){
        var first = form.querySelector('.invalid');
        if(first) first.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var btnHTML = btn ? btn.innerHTML : '';
      if(btn){ btn.disabled = true; btn.innerHTML = 'Enviando...'; }

      /* monta o payload com os campos do formulário */
      var payload = new URLSearchParams();
      form.querySelectorAll('input,select').forEach(function(f){
        if(f.name) payload.append(f.name, f.value);
      });
      payload.append('origem', form.closest('#form-hero-wrap') ? 'Hero' : 'CTA Final');
      payload.append('pagina', location.href);
      payload.append('data_envio', new Date().toISOString());

      function showSuccess(){
        var okBox = form.parentNode.querySelector('.form-ok');
        form.style.display = 'none';
        if(okBox) okBox.classList.add('show');
      }
      function showError(){
        if(btn){ btn.disabled = false; btn.innerHTML = btnHTML; }
        var err = form.querySelector('.send-error');
        if(!err){
          err = document.createElement('div');
          err.className = 'assure send-error';
          err.style.color = '#e06666';
          form.appendChild(err);
        }
        err.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
      }

      /* webhook n8n configurado como GET — envia os campos via query string */
      fetch(WEBHOOK_URL + '?' + payload.toString(), {
        method: 'GET',
        mode: 'no-cors'
      }).then(showSuccess).catch(showError);
    });
    form.querySelectorAll('input,select').forEach(function(f){
      f.addEventListener('input', function(){ f.classList.remove('invalid'); });
    });
  }
  document.querySelectorAll('form.lp-form').forEach(wireForm);

  /* phone mask (BR) */
  document.querySelectorAll('input[type="tel"]').forEach(function(inp){
    inp.addEventListener('input', function(){
      var v = inp.value.replace(/\D/g,'').slice(0,11);
      if(v.length > 6) inp.value = '('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7);
      else if(v.length > 2) inp.value = '('+v.slice(0,2)+') '+v.slice(2);
      else if(v.length > 0) inp.value = '('+v;
    });
  });

  /* CNPJ mask (00.000.000/0000-00) */
  document.querySelectorAll('input[name="cnpj"]').forEach(function(inp){
    inp.addEventListener('input', function(){
      var v = inp.value.replace(/\D/g,'').slice(0,14), out = v;
      if(v.length > 12) out = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, '$1.$2.$3/$4-$5');
      else if(v.length > 8) out = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/, '$1.$2.$3/$4');
      else if(v.length > 5) out = v.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
      else if(v.length > 2) out = v.replace(/^(\d{2})(\d{0,3}).*/, '$1.$2');
      inp.value = out;
    });
  });

  /* count-up stats */
  function animateCount(el){
    var raw = el.getAttribute('data-to');
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var target = parseFloat(raw);
    var dur = 1400, start = null;
    function frame(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString('pt-BR') + suffix;
      if(p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
    }
    requestAnimationFrame(frame);
  }
  var statIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ animateCount(e.target); statIO.unobserve(e.target); }
    });
  }, {threshold:0.5});
  document.querySelectorAll('[data-to]').forEach(function(el){ statIO.observe(el); });

})();
