const detectAdBlocker = () => {
  const blockedElement = document.createElement("div");
  blockedElement.className =
    "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-text adSense adBlock adContent adBanner";
  blockedElement.setAttribute(
    "style",
    "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;",
  );
  document.body.appendChild(blockedElement);
  return (
    window.document.body.getAttribute("abp") != null ||
    blockedElement.offsetParent == null ||
    blockedElement.offsetHeight === 0 ||
    blockedElement.offsetLeft === 0 ||
    blockedElement.offsetTop === 0 ||
    blockedElement.offsetWidth === 0 ||
    blockedElement.clientHeight === 0 ||
    blockedElement.clientWidth === 0
  );
}
var app = app || {};
window.reload2022 = () => {
  location.reload()
}
window.redirect2022 = (url) => {
  location.href = url
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}
function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

var makeElement = () => {
  var blockElement = document.createElement("div");
  blockElement.className = "el-container"
  document.body.classList.add("el-dialog_active")
  blockElement.innerHTML = `
  <style type="text/css">
  body.el-dialog_active {
    overflow: hidden !important;
  }
  .el-dialog-overlay {
    position: fixed;
    background-color: #000;
    z-index: 1023;
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .el-dialog-overlay.active {
    opacity: 0.6;
  }

  .el-dialog-overlay:not(.active),
  .el-dialog:not(.el-dialog-show) {
    display: none;
  }

  .el-dialog {
    color: #000;
    position: fixed;
    z-index: 1024;
    border-radius: 2px;
    width: 35%;
    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 7%);
    left: 35%;
    top: 15%;
    font-size: 16px;
    text-align: center;
    border-radius: 10px;
  }

  .el-dialog-title {
    padding: 24px 24px 20px;
    font-size: 20px;
    color: #000;
    line-height: 1;
    padding-top: 0;
  }

  .el-dialog-content {
    text-align: justify;
    padding: 24px;
    padding-top: 0;
  }

  .el-dialog-message {
    margin: 0;
    padding: 0;
    color: #000;
    font-size: 13px;
    line-height: 1.5;
  }

  .el-dialog-icon.logo {
    width: 100px;
    padding: 1rem;
  }

  .el-dialog {
    padding: 10px;
  }

  .el-dialog-footer {
    padding: 10px;
    padding-top: 0;
  }

  .el-dialog-footer a {
    background-color: #372ac7;
    color: #ffffff;
    width: 100%;
  }

  .el-dialog:not(.el-dialog-show) {
    display: none;
  }

  .el-dialog .el-dialog_body .el-dialog_image_wrapper {
    padding-top: 1rem;
    padding-bottom: 0;
  }

  .el-dialog .el-dialog_body .el-dialog_content .title {
    font-size: 25px;
    font-weight: 400;
    margin: 1rem;
  }

  .el-dialog .el-dialog_body .el-dialog_content .subtitle {
    padding: 0 1rem;
  }

  .el-dialog_buttons {
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #d6d6d6;
    border-bottom: 1px solid #d6d6d6;
  }

  .el-dialog_buttons_row+.el-dialog_buttons_row {
    border-left: 1px solid #d6d6d6;
  }

  .el-dialog_buttons .el-dialog_buttons_row {
    flex: 1 1 auto;
    padding: 1rem;
  }

  .el-dialog_buttons_row div {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 0.3rem;
  }

  .el-dialog_buttons_row button {
    background: #ED1E45;
    border: 1px solid #ED1E45;
    width: 90%;
    padding: 0.4rem;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    border-radius: 0.3rem;
  }

  .el-dialog_footer {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }

  .el-dialog_footer a,
  .el-dialog_footer a:focus {
    text-decoration: none;
    color: #000;
    font-size: 12px;
    font-weight: bold;
    border: none;
    outline: none;
  }

  @media only screen and (max-width:800px) {
    .el-dialog,
    .el-dialog {
      width: calc(35% + 25%);
      left: calc(35% - 10%);
      top: 10%;
    }
  }

  @media only screen and (max-width:500px) {
    .el-dialog,
    .el-dialog {
      width: 95%;
      left: 2%;
      top: 5%;
    }
  }
</style>
<div class="el-dialog-overlay active" id="el-dialog-overlay" tabindex="-1"></div>
<div class="el-dialog el-dialog-hide el-dialog-show" id="el-dialog-modal">
  <div class="el-dialog-modal-container" id="el-dialog-modal-container">
    <div class="el-dialog_body">
      <div class="el-dialog-wrapper">
        <img  src="/images/antivda.svg" class="el-dialog-icon logo" alt="" />
      </div>
      <div class="el-dialog_content">
        <p class="title">Ads Blocker Detected!!!</p>
        <p class="subtitle">We have detected that you are using extensions to block ads. Please support us by disabling
          these ads blocker.</p>
        <div class="el-dialog_buttons">
          <div class="el-dialog_buttons_row">
            <p>Disable Ad Block</p>
            <button type="button" onclick="reload2022()">I've disable Adblock</button>
          </div>
          <div class="el-dialog_buttons_row">
            <p>Donate me</p>
            <button type="button" onclick="redirect2022('/about/')">Go to Donate me</button>
          </div>
        </div>
      </div>
    </div>
    <div class="el-dialog_footer">
      <a href="/about/#whitelist">How to Whitelist a Website?</a>
      <a href="/privacy-policy">Privacy Policy</a>
    </div>
  </div>
</div>
`
  document.body.appendChild(blockElement);
}

const creaBlocktElement = () => {
  setTimeout(() => {
    // exist adblock or had been detected
    if (getCookie('vda') != '1') {
      if (detectAdBlocker()) {
        // body append the anti adblocker element
        makeElement()
      }
    }
  }, 1000)
}

const buildPromotion = () => {
  if (getCookie('tp') != '1'){
    setTimeout(() => {
      window.open('https://tools.w3cub.com/?_sp=docs', '_blank')
      setCookie('tp', 1, 30)
    }, 3000)
  }
}

app.on('ready', () => {
  buildPromotion();
  fetch('/conf/conf.json').then(res => res.json()).then(res => {
    if (res.vda.action) {
      creaBlocktElement()
    }
  }).catch(err => {
    creaBlocktElement()
  })
})




