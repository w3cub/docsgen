(function(){
  function pushAll(){
    var ins = document.querySelectorAll('ins.adsbygoogle:not([data-ad-status]):not([data-ads-pushed])');
    if (!ins || ins.length === 0) return;
    ins.forEach(function(el){
      try{ (adsbygoogle = window.adsbygoogle || []).push({}); el.setAttribute('data-ads-pushed','1'); }catch(e){}
    });
  }

  if (window.__ads_loaded){
    if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function'){
      pushAll();
    } else {
      window.addEventListener('adsense:ready', pushAll, { once: true });
    }
  } else {
    window.addEventListener('adsense:ready', pushAll, { once: true });
  }
})();
