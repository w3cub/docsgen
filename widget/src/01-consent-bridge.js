(function(){
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  var __consent_state;

  function waitTCF(cb){
    if (typeof __tcfapi === 'function') {
      cb();
    } else {
      var i = setInterval(function(){
        if (typeof __tcfapi === 'function'){
          clearInterval(i);
          cb();
        }
      }, 50);
    }
  }

  function safeGtag(){
    if (typeof gtag !== 'function') return;
    gtag.apply(null, arguments);
  }

  function applyConsent(granted){
    if (__consent_state === granted) return;
    __consent_state = granted;
    safeGtag('consent','update',{
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied'
    });
  }

  function syncTCData(){
    try{
      __tcfapi('getTCData', 2, function(tcData, success){
        if (success && tcData){
          var granted = tcData.purpose && tcData.purpose.consents && tcData.purpose.consents[1];
          applyConsent(!!granted);
        }
      });
    }catch(e){}
  }

  window.googlefc.callbackQueue.push({
    CONSENT_API_READY: function(){
      waitTCF(function(){
        syncTCData();
        try{
          __tcfapi('addEventListener', 2, function(tcData, success){
            if (!success) return;
            var granted = tcData.purpose && tcData.purpose.consents && tcData.purpose.consents[1];
            applyConsent(!!granted);
          });
        }catch(e){}
      });
    }
  });
})();
