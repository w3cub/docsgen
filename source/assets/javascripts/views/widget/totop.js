app.views.ToTopView = class ToTopView extends app.View {

  constructor(...args) {
    super(...args);
  }

  static tagName = 'a';
  static className = '_totop';

  static events = {
    click: 'onClick',
    touchend: 'onTouchEnd'
  };

  init() {
    this.activate();
    this.render();
    return this.bindContentScroll();
  }
  bindContentScroll() {
    this._content = document.documentElement;
    const timer = undefined;

    const addEventListener = function(el, evt, fn) {
      if (window.addEventListener) { el.addEventListener(evt, fn, false); } else if (window.attachEvent) { el.attachEvent('on' + evt, fn); } else { el['on' + evt] = fn; }
    };

    addEventListener(window, "scroll", ()  => {
      timer && clearTimeout(timer);
      return setTimeout(() => {
        return this.updatePosition();
      }
      , 50);
    });
    addEventListener(window, "load", ()  => {
      return this.updatePosition();
    });
    return this.updatePosition();
  }
  render() {
    this.el.setAttribute('href', 'javascript:;');
    this.el.setAttribute('title', 'Go to Top');
    return document.body.appendChild(this.el);
  }
  show() {
    return this.el.style.display = 'block';
  }

  hide() {
    return this.el.style.display = 'none';
  }
  onTouchEnd() {
    // cancel hover status
    return this.el.blur();
  }
  onClick() {
    this.el.focus();
    const content = this._content;
    return $.animate(content, (function(process){
        return this.scrollTop = process;
      }), content.scrollTop, 0, 500);
  }

  updatePosition() {
    if (this._content.scrollTop > 100) {
      return this.show();
    } else {
      return this.hide();
    }
  }
};

