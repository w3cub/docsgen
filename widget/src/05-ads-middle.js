(function(){
  var page = document.querySelector('._page');
  if (!page) return;
  if (page.querySelector('ins.adsbygoogle[data-ad-slot="6879550993"]')) return;
  var AD_HTML = '<ins class="adsbygoogle" style="display:block;margin:32px 0" data-ad-client="ca-pub-2572770204602497" data-ad-layout="in-article" data-ad-slot="6879550993" data-ad-format="fluid"></ins>';
  var BLOCK = 'H1,H2,H3,H4,H5,H6,PRE,CODE,TABLE,FIGURE,BLOCKQUOTE,UL,OL,DETAILS,SUMMARY';
  var MIN_CHARS = 200;
  var children = Array.from(page.children).filter(function(el){
    var tag = el.tagName;
    return tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'INS';
  });
  var total = children.reduce(function(s,el){ return s + (el.textContent||'').trim().length; }, 0);
  if (total < MIN_CHARS*2) { return; }
  var half = total/2;
  var acc = 0;
  var insertAfter = null;
  for (var i=0;i<children.length;i++){
    var el = children[i];
    var len = (el.textContent||'').trim().length;
    var prevAcc = acc;
    acc += len;
    if (acc < total*0.3) continue;
    if (acc >= half){
      var closer = Math.abs(prevAcc-half) < Math.abs(acc-half) ? i-1 : i;
      closer = Math.max(0, Math.min(closer, children.length-2));
      var candidate = children[closer];
      if (candidate.matches(BLOCK) && closer+1 < children.length-1) closer++;
      insertAfter = children[closer];
      break;
    }
  }
  if (!insertAfter) insertAfter = children[Math.floor(children.length/2)-1];
  if (!insertAfter) return;
  var wrap = document.createElement('div');
  wrap.innerHTML = AD_HTML;
  var el = wrap.firstElementChild;
  insertAfter.insertAdjacentElement('afterend', el);
  try{ (adsbygoogle = window.adsbygoogle || []).push({}); el.dataset.adsPushed = '1'; }catch(e){}
})();
