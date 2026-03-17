app.views.Mobile = class Mobile extends app.View {
  static el = document.documentElement;

  static elements = {
    body: "body",
    content: "._container",
    sidebar: "._sidebar",
    docPicker: "._settings ._sidebar",
  };

  static shortcuts = { escape: "onEscape" };

  static routes = { after: "afterRoute" };

  static detect() {
    if (Cookies.get("override-mobile-detect") != null) {
      return JSON.parse(Cookies.get("override-mobile-detect"));
    }
    try {
      return (
        window.matchMedia("(max-width: 480px)").matches ||
        window.matchMedia("(max-width: 767px)").matches ||
        window.matchMedia("(max-height: 767px) and (max-width: 1024px)")
          .matches ||
        // Need to sniff the user agent because some Android and Windows Phone devices don't take
        // resolution (dpi) into account when reporting device width/height.
        (navigator.userAgent.includes("Android") &&
          navigator.userAgent.includes("Mobile")) ||
        navigator.userAgent.includes("IEMobile")
      );
    } catch (error) {
      return false;
    }
  }

  static detectAndroidWebview() {
    try {
      return /(Android).*( Version\/.\.. ).*(Chrome)/.test(navigator.userAgent);
    } catch (error) {
      return false;
    }
  }

  _getVendorPrefix() {
    const regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/;
    const styleDeclaration = document.getElementsByTagName('script')[0].style;
    for (const prop in styleDeclaration) {
      if (regex.test(prop)) {
        return '-' + prop.match(regex)[0].toLowerCase() + '-';
      }
    }
    // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
    // However (prop in style) returns the correct value, so we'll have to test for
    // the precence of a specific property
    if ('WebkitOpacity' in styleDeclaration) {
      return '-webkit-';
    }
    if ('KhtmlOpacity' in styleDeclaration) {
      return '-khtml-';
    }
    return '';
  }

  init() {
    if ($.isTouchScreen()) {
      FastClick.attach(this.body);
      app.shortcuts.stop();
    }

    this.panel = $("._container");
    this.panelContent = $("._content");
    this.sidebar = $("._sidebar");
    this.header = $("._header");

    this._initTouchEvents();
    this._initEventListeners();

    this.activate();
  }

  _initTouchEvents() {
    const doc = window.document;
    const html = this.el;
    const msPointerSupported = window.navigator.msPointerEnabled;
    const touch = {
      start: msPointerSupported ? 'MSPointerDown' : 'touchstart',
      move: msPointerSupported ? 'MSPointerMove' : 'touchmove',
      end: msPointerSupported ? 'MSPointerUp' : 'touchend'
    };

    this._prefix = this._getVendorPrefix();

    let scrollTimeout;
    let scrolling = false;


    this._onScrollFn = $.decouple(this.panelContent, 'scroll', () => {
      if (!this._moved) {
        clearTimeout(scrollTimeout);
        scrolling = true;
        scrollTimeout = setTimeout(() => {
          scrolling = false;
        }, 250);
      }
    });

    /**
     * Prevents touchmove event if slideout is moving
     */

    this._preventMove = (eve) => {
      if (this._moved) {
        eve.preventDefault();
      }
    };
    this.panel.addEventListener(touch.move, this._preventMove);

    /**
     * Resets values on touchstart
     */

    this._resetTouchFn = (eve) => {
      if (typeof eve.touches === 'undefined') {
        return;
      }
      this._moved = false;
      this._opening = false;
      this._startOffsetX = eve.touches[0].clientX;
      this._startOffsetY = eve.touches[0].clientY;
      this._preventOpen = !this._touch || (!this.isSidebarShown() && (this.sidebar.clientWidth !== 0));
    };

    this.panel.addEventListener(touch.start, this._resetTouchFn);


    /**
     * Resets values on touchcancel
     */

    this._onTouchCancelFn = () => {
      this._moved = false;
      this._opening = false;
    };

    this.panel.addEventListener('touchcancel', this._onTouchCancelFn);

    /**
     * Toggles slideout on touchend
     */

    this._onTouchEndFn = () => {
      if (this._moved) {
        if (this._opening && (Math.abs(this._currentOffsetX / this._currentOffsetY) > this._ratio) && (Math.abs(this._currentOffsetX) > this._tolerance)) {
          this.showSidebar();
        } else {
          this.hideSidebar();
        }
      }
      this._moved = false;
    };

    this.panel.addEventListener(touch.end, this._onTouchEndFn);

    /**
     * Translates panel on touchmove
     */

    this._onTouchMoveFn = (eve) => {
      if (scrolling || this._preventOpen || (typeof eve.touches === 'undefined')) {
        return;
      }
      const dif_x = eve.touches[0].clientX - this._startOffsetX;
      const dif_y = eve.touches[0].clientY - this._startOffsetY;
      let translateX = (this._currentOffsetX = dif_x);
      const translateY = (this._currentOffsetY = dif_y);
      if (Math.abs(translateX) > this._padding) {
        return;
      }
      if ((Math.abs(dif_x) > 20) && (Math.abs(dif_x / dif_y) > this._ratio) && eve.cancelable) {
        this._opening = true;
        const oriented_dif_x = dif_x * this._orientation;
        if ((this._opened && (oriented_dif_x > 0)) || (!this._opened && (oriented_dif_x < 0))) {
          return;
        }
        if (oriented_dif_x <= 0) {
          translateX = dif_x + (this._padding * this._orientation);
          this._opening = false;
        }
        if (!this._moved && (html.className.search('_open-sidebar') === -1)) {
          html.className += ' _open-sidebar';
        }
        this.panel.style[this._prefix + 'transform'] = (this.panel.style.transform = 'translateX(' + translateX + 'px)');
        this.header.style[this._prefix + 'transform'] = (this.header.style.transform = 'translateX(' + translateX + 'px)');
        this._moved = true;
      }
    };

    this.panel.addEventListener(touch.move, this._onTouchMoveFn);
  }

  _initEventListeners() {
    $.on(this.body, 'click', this.onClick);
    $.on($('._menu-link'), 'click', this.onClickMenu);
    $.on($('._search'), 'touchend', this.onTapSearch);
  }
  _setTransition() {
    this.panel.style[this._prefix + 'transition'] = (this.panel.style.transition = this._prefix + 'transform ' + this._duration + 'ms ' + this._fx);
    this.header.style[this._prefix + 'transition'] = (this.header.style.transition = this._prefix + 'transform ' + this._duration + 'ms ' + this._fx);
  }
  _translateXTo(translateX) { 
    this._currentOffsetX = translateX;
    this._currentOffsetY = 0;
    this.panel.style[this._prefix + 'transform'] = (this.panel.style.transform = 'translateX(' + translateX + 'px)');
    this.header.style[this._prefix + 'transform'] = (this.header.style.transform = 'translateX(' + translateX + 'px)');
  }
  showSidebar() {
    let selection;
    if (this.isSidebarShown()) { return; }
    this.contentTop = this.body.scrollTop;
    this.addClass('_open-sidebar');

    this._setTransition();
    this._translateXTo(this._translateTo);
    this._opened = true;

    // @content.style.display = 'none'
    // @sidebar.style.display = 'block'

    if ((selection = this.findByClass(app.views.ListSelect.activeClass))) {
      $.scrollTo(selection, this.body, 'center');
    } else {
      this.body.scrollTop = (this.findByClass(app.views.ListFold.activeClass) && this.sidebarTop) || 0;
    }

    setTimeout(() => {
      this.panel.style.transition = (this.panel.style['-webkit-transition'] = (this.panel.style[this._prefix + 'transform'] = (this.panel.style.transform = '')));
      this.header.style.transition = (this.header.style['-webkit-transition'] = (this.header.style[this._prefix + 'transform'] = (this.header.style.transform = '')));
    }, this._duration + 50);
  }
  hideSidebar() {
    if (!this.isSidebarShown() && !this._opening) { return; }
    this.sidebarTop = this.body.scrollTop;
    

    this._setTransition();
    this._translateXTo(0);
    this._opened = false;

    // @sidebar.style.display = 'none'
    // @content.style.display = 'block'
    this.body.scrollTop = this.contentTop || 0;
    setTimeout(() => {
      this.removeClass('_open-sidebar');
      this.panel.style.transition = (this.panel.style['-webkit-transition'] = (this.panel.style[this._prefix + 'transform'] = (this.panel.style.transform = '')));
      this.header.style.transition = (this.header.style['-webkit-transition'] = (this.header.style[this._prefix + 'transform'] = (this.header.style.transform = '')));
    }, this._duration + 50);
  }

  isSidebarShown() {
    return this._opened;
  }
    // ~[].slice.call(@el.classList, 0).indexOf('_open-sidebar')
    // @sidebar.style.display isnt 'none'

  onClick(event) {
    if (event.target.hasAttribute('data-pick-docs')) {
      this.showSidebar();
    }
  }



  onClickMenu() {
    if (this.isSidebarShown()) { this.hideSidebar(); } else { this.showSidebar(); }
  }

  onTapSearch() {
    return this.body.scrollTop = 0;
  }
  
  onEscape() {
    return this.hideSidebar();
  }

  afterRoute() {
    this.hideSidebar();
  }
};
