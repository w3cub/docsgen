(function(){
  if (window.__ads_lazy_init) return;
  window.__ads_lazy_init = true;

  function trigger(){
    if (window.__ads_lazy) return;
    window.__ads_lazy = true;
    var ins = document.querySelectorAll('ins.adsbygoogle:not([data-ad-status]):not([data-ads-pushed])');
    if (!ins || ins.length === 0) return;
    var pushFn = function(){
      ins.forEach(function(el){
        try{ (adsbygoogle = window.adsbygoogle || []).push({}); el.setAttribute('data-ads-pushed','1'); }catch(e){}
      });
    };
    if (window.__ads_loaded && window.adsbygoogle && typeof window.adsbygoogle.push === 'function'){
      pushFn();
    } else {
      window.addEventListener('adsense:ready', pushFn, { once: true });
    }
  }

  window.addEventListener('scroll', trigger, { once: true });
})();
