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
  // 25s
  setCookie('vda', 1, 0.0003)
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
        <img
          src="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjEwMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWOu+W5v+WRiiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9ImFicCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQuNDQ3NTkyLCAxNC40NDc1OTIpIj4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSLot6/lvoQiIGZpbGw9IiNEOEQ5RDkiIHBvaW50cz0iMjEuMzIzODY4NSAwIDAgMjEuMzI0MTYxIDAgNTEuNDgwMzcxNiAyMS4zMjM4Njg1IDcyLjgwNDUzMjYgNTEuNDc5ODM2OCA3Mi44MDQ1MzI2IDcyLjgwNDUzMjYgNTEuNDgwMzcxNiA3Mi44MDQ1MzI2IDIxLjMyMzc0NzMgNTEuNDgwMjUwNSAwIj48L3BvbHlnb24+CiAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0i6Lev5b6EIiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjIxLjkwNDIzNjQgMS40MDAyMzgzMSAxLjM5OTgzMjYgMjEuOTAzNjk4MyAxLjM5OTgzMjYgNTAuOTAwNDIwNiAyMS45MDQyMzY0IDcxLjQwMzg4MDYgNTAuOTAxMTIzNSA3MS40MDM4ODA2IDcxLjQwNDcgNTAuOTAwNDIwNiA3MS40MDQ3IDIxLjkwMzY5ODMgNTAuOTAxMTIzNSAxLjQwMDIzODMxIj48L3BvbHlnb24+CiAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0i6Lev5b6EIiBmaWxsPSIjRUQxRTQ1IiBwb2ludHM9IjIzLjI1NjA4NDIgNjguMTM4ODY0MSA0LjY2NDg2NzY5IDQ5LjU0NzMzOTUgNC42NjQ4Njc2OSAyMy4yNTY3Nzk0IDIzLjI1NjA4NDIgNC42NjUyNTQ4NSA0OS41NDg0NDg0IDQuNjY1MjU0ODUgNjguMTM4ODM3NiAyMy4yNTY3Nzk0IDY4LjEzODgzNzYgNDkuNTQ3NzUzMiA0OS41NDg0NDg0IDY4LjEzOTI3NzciPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOS4wNjM2MTg3LDM4LjE5MDMxMDYgTDE4LjU2NzIyNDEsMzUuOTAyNzcyMSBDMTguMjQxNzQ5NiwzNC41ODc3MjcyIDE3Ljk0MzU3MywzMy4yNjYwNzYxIDE3LjY3Mjg4NjYsMzEuOTM4NjcwNiBDMTcuMzk1ODE5NywzMC41ODk1NDE2IDE3LjEwODczMDMsMjkuMjQyNDkwMyAxNi44MTE2NDIxLDI3Ljg5NzYyODMgTDE2LjY3OTI3MDIsMjcuODk3NjI4MyBDMTYuNDE0MTEyOCwyOS4yMTk2ODQ5IDE2LjE0MzE2NDEsMzAuNTcyNzY2IDE1Ljg2ODA3ODgsMzEuOTU4MTEyNiBDMTUuNjA1Nzg0OSwzMy4yNzk1NTk1IDE1LjMxMzExMDQsMzQuNTk0Nzk0MyAxNC45OTAyODc4LDM1LjkwMjc3MjEgTDE0LjQ1OTU1OTMsMzguMTkwMzEwNiBMMTkuMDYzNjE4NywzOC4xOTAzMTA2IEwxOS4wNjM2MTg3LDM4LjE5MDMxMDYgWiBNMjAuMDU3MjM1MSw0Mi41NzQyNzY4IEwxMy40NjYzNTY2LDQyLjU3NDI3NjggTDEyLjE0MTgxMDUsNDguNDgyNTc5MyBMNy4xNzM3Mjg0Myw0OC40ODI1NzkzIEwxMy45MzAwNzE4LDIzLjYyODI0NTkgTDE5Ljc5MjA3NzYsMjMuNjI4MjQ1OSBMMjYuNTQ5MjQ4Myw0OC40ODI1NzkzIEwyMS4zODE3ODEyLDQ4LjQ4MjU3OTMgTDIwLjA1NzIzNTEsNDIuNTc0Mjc2OCBaIE0zNy4xODA3Nzg0LDQ0LjEzNzA4MzQgQzM5Ljg1MTc5NDcsNDQuMTM3MDgzNCA0MS4xODc5MjMzLDQzLjAwNjEzNzYgNDEuMTg3OTIzMyw0MC43NDQ2NTk3IEM0MS4xODc5MjMzLDM5LjY1MTc3MDYgNDAuODU2OTkzNiwzOC44NTc1NDM4IDQwLjE5NDMwNjksMzguMzYxOTc5NCBDMzkuNTMxNjIwMiwzNy44NjYwMDE0IDM4LjUyNjgzNDksMzcuNjE4NjMyOCAzNy4xODA3Nzg0LDM3LjYxODYzMjggTDM0LjQzMTU4LDM3LjYxODYzMjggTDM0LjQzMTU4LDQ0LjEzNzA4MzQgTDM3LjE4MDc3ODQsNDQuMTM3MDgzNCBMMzcuMTgwNzc4NCw0NC4xMzcwODM0IFogTTM2LjcxNjY0OTUsMzMuNjUzNzA0IEMzNy45MDkyMzc0LDMzLjY1MzcwNCAzOC43NzU0NDU5LDMzLjM4MTUxNTggMzkuMzE2NTE1OSwzMi44MzQ2NTc2IEMzOS44NTc1ODYsMzIuMjg4NjI2NyA0MC4xMjg1MzQ2LDMxLjU0NDg2NjUgNDAuMTI4NTM0NiwzMC42MDQyMDQyIEM0MC4xMjg1MzQ2LDI5LjY2NDM2OTIgMzkuODUxNzk0NywyOC45OTA5MzExIDM5LjI5OTk2OTQsMjguNTg0MzAzNSBDMzguNzQ4MTQ0MiwyOC4xNzc2NzYgMzcuODk3NjU0OCwyNy45NzM3NDE3IDM2Ljc0OTc0MjUsMjcuOTczNzQxNyBMMzQuNDMxNTgsMjcuOTczNzQxNyBMMzQuNDMxNTgsMzMuNjUzNzA0IEwzNi43MTY2NDk1LDMzLjY1MzcwNCBMMzYuNzE2NjQ5NSwzMy42NTM3MDQgWiBNMjkuNTYzMTkwNSwyMy42Mjg2NTk1IEwzNi45NDgzMDAzLDIzLjYyODY1OTUgQzM4LjA3NTExNTksMjMuNjI4NjU5NSAzOS4xMTc5NTgxLDIzLjcyMzgwMTMgNDAuMDc4NDgxNSwyMy45MTQ0OTg0IEM0MS4wMzk0MTg2LDI0LjEwNTE5NTYgNDEuODc3OTExNywyNC40NDE5MTQ2IDQyLjU5NjAyOTIsMjQuOTI0NjU1NiBDNDMuMzEyOTA1NiwyNS40MDc4MTAyIDQzLjg3NjMxMzQsMjYuMDQzMTkxNiA0NC4yODUwMTE2LDI2LjgzMDM4NjEgQzQ0LjY5MzI5NjEsMjcuNjE4ODIxNiA0NC44OTc2NDUyLDI4LjYwOTk1MDQgNDQuODk3NjQ1MiwyOS44MDM3NzI1IEM0NC44OTY2MTQ4LDMwLjM2OTg0OTggNDQuODI0MzQ1NSwzMC45MzM1NDcxIDQ0LjY4MjU0MDksMzEuNDgxNTc2NSBDNDQuNTQyNDg0NCwzMi4wMzA0MjcyIDQ0LjMyNDkxNjcsMzIuNTU2NTE0OCA0NC4wMzY0MDA3LDMzLjA0Mzk2OTUgQzQzLjc0ODkwNTUsMzMuNTI3MTI0MSA0My4zNzM3MTM5LDMzLjk1ODk4NDkgNDIuOTEwNDEyNCwzNC4zMzk5NjU1IEM0Mi40NDY2OTcxLDM0LjcyMTc3MzUgNDEuOTA1MjEzNCwzNS4wMDA5OTM4IDQxLjI4NzIwMjIsMzUuMTc5MjgxMiBMNDEuMjg3MjAyMiwzNS4zMzE1MDggQzQyLjgzMjY0MzksMzUuNjYxNjA4NSA0My45OTc5MzAxLDM2LjI5NzgxNzIgNDQuNzgxODE5OCwzNy4yMzY4MjQ5IEM0NS41NjUyOTU4LDM4LjE3NzkwMDggNDUuOTU3MDMzOSwzOS40ODY3MjAzIDQ1Ljk1NzAzMzksNDEuMTYzMjgzNCBDNDUuOTU3MDMzOSw0Mi40MzQ0NTk4IDQ1Ljc0MTkyOTYsNDMuNTI3MzQ4OSA0NS4zMTE3MjEsNDQuNDQyMzY0MyBDNDQuODgxNTEyNCw0NS4zNTczNzk3IDQ0LjI4NTAxMTYsNDYuMTEzNTQ5OCA0My41MjMwNDYsNDYuNzEwNDYwOCBDNDIuNzYxMDgwNCw0Ny4zMDc3ODU1IDQxLjg3MjEyMDUsNDcuNzUyODgzNSA0MC44NTY5OTM2LDQ4LjA0NDA5OTkgQzM5Ljg0MTAzOTUsNDguMzM3Mzg0NyAzOC43NDgxNDQyLDQ4LjQ4Mjk5MjkgMzcuNTc4MzA3Nyw0OC40ODI5OTI5IEwyOS41NjMxOTA1LDQ4LjQ4Mjk5MjkgTDI5LjU2MzE5MDUsMjMuNjI5MDczMiBMMjkuNTYzMTkwNSwyMy42Mjg2NTk1IFogTTU2Ljg4NzIyOCwzNS41OTgzMTg1IEM1OS41MzY3MzM4LDM1LjU5ODMxODUgNjAuODYxMjc5OSwzNC4yNzcwODkyIDYwLjg2MTI3OTksMzEuNjMzODAzMyBDNjAuODYxMjc5OSwzMC4zMzc4MDczIDYwLjUyNDU1OSwyOS40MjI3OTE5IDU5Ljg1MTUzMDcsMjguODg5MTcwOCBDNTkuMTc3MjYxNSwyOC4zNTUxMzYgNTguMTg5NDM2MywyOC4wODgzMjU1IDU2Ljg4NzIyOCwyOC4wODgzMjU1IEw1NC4xNzE1MzYyLDI4LjA4ODMyNTUgTDU0LjE3MTUzNjIsMzUuNTk4MzE4NSBMNTYuODg3MjI4LDM1LjU5ODMxODUgWiBNNDkuMzAyMzE5NCwyMy42Mjg2NTk1IEw1Ny4xODUwNjQ3LDIzLjYyODY1OTUgQzU4LjM1NTMxNDgsMjMuNjI4NjU5NSA1OS40NTQwMDE0LDIzLjc2MTg1OCA2MC40ODAyOTcxLDI0LjAyOTA4MjIgQzYxLjUwNzQyMDIsMjQuMjk1NDc5MSA2Mi40MDE3NTc3LDI0Ljc0MDU3NyA2My4xNjMzMDk2LDI1LjM2MjcyMTMgQzYzLjkyNTI3NTIsMjUuOTg2MTA2NSA2NC41MjYzMjYzLDI2LjgxMTc3MTQgNjQuOTY4NTMxMSwyNy44NDA5NTY5IEM2NS40MDk5MDg2LDI4Ljg2OTcyODggNjUuNjMwMzkwNSwzMC4xMzQyODY3IDY1LjYzMDM5MDUsMzEuNjM0MjE3IEM2NS42MzAzOTA1LDMzLjA4MjAyNjIgNjUuNDA0MTE3MywzNC4zMzk5NjU1IDY0Ljk1MTU3MSwzNS40MDcyMDc3IEM2NC40OTkwMjQ2LDM2LjQ3NTI3NzIgNjMuODg2MzkxLDM3LjM1MTQwODYgNjMuMTEzNjcwMiwzOC4wMzgwODM4IEM2Mi4zNDAxMjIsMzguNzIzOTMxNyA2MS40NDYxOTgyLDM5LjIzMjczMzIgNjAuNDMxMDcxMywzOS41NjI0MjAxIEM1OS40MTQ3MDM1LDM5Ljg5MzM0NzkgNTguMzMyOTc3MSw0MC4wNTg4MTE4IDU3LjE4NTA2NDcsNDAuMDU4ODExOCBMNTQuMTcxNTM2Miw0MC4wNTg4MTE4IEw1NC4xNzE1MzYyLDQ4LjQ4MjU3OTMgTDQ5LjMwMjMxOTQsNDguNDgyNTc5MyBMNDkuMzAyMzE5NCwyMy42Mjg2NTk1IEw0OS4zMDIzMTk0LDIzLjYyODY1OTUgWiIgaWQ9IuW9oueKtiIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDxnIGlkPSJiYW4iIGZpbGw9IiNFRDFFNDUiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTUwLDAgQzc3LjYxNDI4NTgsMCAxMDAsMjIuMzg1NzE0MyAxMDAsNTAgQzEwMCw3Ny42MTQyODU3IDc3LjYxNDI4NTgsMTAwIDUwLDEwMCBDMjIuMzg1NzE0MiwxMDAgMCw3Ny42MTQyODU4IDAsNTAgQzAsMjIuMzg1NzE0MiAyMi4zODU3MTQyLDAgNTAsMCBaIE04My41ODU3MTQzLDIxLjc2MzI2NTMgTDIyLjE1NzE0MjksODMuMTkxODM2OCBDMjIuMDI0MTg4NCw4My4zMjQ1MTY5IDIxLjg3OTM2NjMsODMuNDQ0NzQ2NSAyMS43MjQ0ODk3LDgzLjU1MTAyMDQgQzI5LjYyODk5MjksOTAuMjMzNjg0NCAzOS42NDkyMDY2LDkzLjg5MzE3NzggNTAsOTMuODc3NjAwOSBDNzQuMjMyNjUzMSw5My44Nzc2MDA5IDkzLjg3NzU1MSw3NC4yMzI2NTMxIDkzLjg3NzU1MSw1MCBDOTMuODc3NTUxLDM5LjI0NDg5OCA5MC4wMDgxNjMzLDI5LjM5Mzg3NzYgODMuNTg1NzE0MywyMS43NjMyNjUzIFogTTUwLDYuMTIyNDExMjEgQzI1Ljc2NzM0NjksNi4xMjI0MTEyMSA2LjEyMjQwMzgzLDI1Ljc2NzM0NjkgNi4xMjI0MDM4Myw1MCBDNi4xMDY4NTQxNyw2MC44NTU5NzEzIDEwLjEzMTIyMDcsNzEuMzI5MzYzMyAxNy40MTIyNDQ5LDc5LjM4MTYzMjcgQzE3LjUzMDYxMjMsNzkuMTk1OTE4NCAxNy42NjkzODc4LDc5LjAyMjQ0OSAxNy44MzA2MTIyLDc4Ljg2MTIyNDUgTDc5LjMyNjUzMDYsMTcuMzY3MzQ2OSBDNzEuMjgxNjQ4NiwxMC4xMTUzODY2IDYwLjgzMTAxMzUsNi4xMDgyMTg5MiA1MCw2LjEyMjQxMTIxIFoiIGlkPSLlvaLnirYiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
          class="el-dialog-icon logo" alt="" />
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
            <button type="button" onclick="redirect2022('https://docs.w3cub.com/about/')">Go to Donate me</button>
          </div>
        </div>
      </div>
    </div>
    <div class="el-dialog_footer">
      <a href="https://docs.w3cub.com/about/#whitelist">How to Whitelist a Website?</a>
      <a href="https://docs.w3cub.com/privacy-policy">Privacy Policy</a>
    </div>
  </div>
</div>
`
  document.body.appendChild(blockElement);
}

creaBlocktElement = () => {
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

buildPromotion = () => {
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




