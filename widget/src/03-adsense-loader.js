(function(){
  if (window.__ads_loader_init) return;
  window.__ads_loader_init = true;

  function loadAds(){
    if (window.__ads_loaded) return;
    window.__ads_loaded = true;

    var s = document.createElement('script');
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2572770204602497';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = function(){ window.dispatchEvent(new Event('adsense:ready')); };
    document.head.appendChild(s);

    var amp = document.createElement('script');
    amp.async = true;
    amp.setAttribute('custom-element','amp-auto-ads');
    amp.src = 'https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js';
    document.head.appendChild(amp);

    if (document.body && !document.querySelector('amp-auto-ads')){
      var autoAds = document.createElement('amp-auto-ads');
      autoAds.setAttribute('type','adsense');
      autoAds.setAttribute('data-ad-client','ca-pub-2572770204602497');
      document.body.appendChild(autoAds);
    }
  }

  window.__ads_loadAds = loadAds;
  loadAds();
})();
