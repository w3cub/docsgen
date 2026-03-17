app.views.Mobile = class Mobile extends app.View {
  // static className = "_mobile";

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

  constructor() {
    super(document.documentElement);
  }

  init() {
    if ($.isTouchScreen()) {
      FastClick.attach(this.body);
      app.shortcuts.stop();
    }

    const doc = window.document;
    const html = this.el;
    this.panel = $("._container");
    this.panelCentent = $("._content");
    this.sidebar = $("._sidebar");
    this.header = $("._header");
    const self = this;
    const msPointerSupported = window.navigator.msPointerEnabled;
    const touch = { 
      'start': msPointerSupported ? 'MSPointerDown' : 'touchstart',
      'move': msPointerSupported ? 'MSPointerMove' : 'touchmove',
      'end': msPointerSupported ? 'MSPointerUp' : 'touchend'
    };
    
    this._prefix = (function() {
      const regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/;
      const styleDeclaration = doc.getElementsByTagName('script')[0].style;
      for (var prop in styleDeclaration) {
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
    })();


    $.on(this.body, 'click', this.onClick);
    // $.on $('._home-link'), 'click', @onClickHome
    $.on($('._menu-link'), 'click', this.onClickMenu);
    $.on($('._search'), 'touchend', this.onTapSearch);


    let scrollTimeout = undefined;
    let scrolling = false;

    this._startOffsetX = 0;
    this._currentOffsetX = 0;
    this._startOffsetY = 0;
    this._currentOffsetY = 0;

    this._opening = false;
    this._moved = false;
    this._opened = false;
    this._preventOpen = false;
    this._touch = true;
    this._fx = 'ease';
    this._duration = 300;
    this._tolerance = 70;
    this._ratio = 2;
    this._padding = (this._translateTo = 250);
    this._orientation = 1; // left
    this._translateTo *= this._orientation;


    this._onScrollFn = $.decouple(this.panelCentent, 'scroll', function() {
      if (!self._moved) {
        clearTimeout(scrollTimeout);
        scrolling = true;
        scrollTimeout = setTimeout((function() {
          scrolling = false;
        }), 250);
      }
    });

    /**
     * Prevents touchmove event if slideout is moving
     */

    this._preventMove = function(eve) {
      if (self._moved) {
        eve.preventDefault();
      }
    };
    this.panel.addEventListener(touch.move, this._preventMove);

    /**
     * Resets values on touchstart
     */

    this._resetTouchFn = function(eve) {
      if (typeof eve.touches === 'undefined') {
        return;
      }
      self._moved = false;
      self._opening = false;
      self._startOffsetX = eve.touches[0].clientX;
      self._startOffsetY = eve.touches[0].clientY;
      self._preventOpen = !self._touch || (!self.isSidebarShown() && (self.sidebar.clientWidth !== 0));
    };

    this.panel.addEventListener(touch.start, this._resetTouchFn);


    /**
     * Resets values on touchcancel
     */

    this._onTouchCancelFn = function() {
      self._moved = false;
      self._opening = false;
    };

    this.panel.addEventListener('touchcancel', this._onTouchCancelFn);

    /**
     * Toggles slideout on touchend
     */

    this._onTouchEndFn = function() {
      if (self._moved) {
        // self.emit 'translateend'
        if (self._opening &&  (Math.abs(self._currentOffsetX / self._currentOffsetY) > self._ratio) && (Math.abs(self._currentOffsetX) > self._tolerance)) { self.showSidebar(); } else { self.hideSidebar(); }
      }
      self._moved = false;
    };

    this.panel.addEventListener(touch.end, this._onTouchEndFn);

    /**
     * Translates panel on touchmove
     */

    this._onTouchMoveFn = function(eve) {
      if (scrolling || self._preventOpen || (typeof eve.touches === 'undefined')) {
        return;
      }
      const dif_x = eve.touches[0].clientX - (self._startOffsetX);
      const dif_y = eve.touches[0].clientY - (self._startOffsetY);
      let translateX = (self._currentOffsetX = dif_x);
      const translateY = (self._currentOffsetY = dif_y);
      if (Math.abs(translateX) > self._padding) {
        return;
      }
      if ((Math.abs(dif_x) > 20) && (Math.abs(dif_x / dif_y) > self._ratio) && eve.cancelable) {
        self._opening = true;
        const oriented_dif_x = dif_x * self._orientation;
        if ((self._opened && (oriented_dif_x > 0)) || (!self._opened && (oriented_dif_x < 0))) {
          return;
        }
        // if !self._moved
        //   self.emit 'translatestart'
        if (oriented_dif_x <= 0) {
          translateX = dif_x + (self._padding * self._orientation);
          self._opening = false;
        }
        if (!self._moved && (html.className.search('_open-sidebar') === -1)) {
          html.className += ' _open-sidebar';
        }
        self.panel.style[self._prefix + 'transform'] = (self.panel.style.transform = 'translateX(' + translateX + 'px)');
        self.header.style[self._prefix + 'transform'] = (self.header.style.transform = 'translateX(' + translateX + 'px)');
        // self.emit 'translate', translateX
        self._moved = true;
      }
    };

    this.panel.addEventListener(touch.move, this._onTouchMoveFn);


    // app.document.sidebar.search
    //   .on 'searching', @showSidebar
    //   .on 'clear', @hideSidebar

    this.activate();
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

    setTimeout((() => {
      this.panel.style.transition = (this.panel.style['-webkit-transition'] = (this.panel.style[this._prefix + 'transform'] = (this.panel.style.transform = '')));
      this.header.style.transition = (this.header.style['-webkit-transition'] = (this.header.style[this._prefix + 'transform'] = (this.header.style.transform = '')));
    }
    ), this._duration + 50);
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
    setTimeout((() => {
      this.removeClass('_open-sidebar');
      this.panel.style.transition = (this.panel.style['-webkit-transition'] = (this.panel.style[this._prefix + 'transform'] = (this.panel.style.transform = '')));
      this.header.style.transition = (this.header.style['-webkit-transition'] = (this.header.style[this._prefix + 'transform'] = (this.header.style.transform = '')));
    }
    ), this._duration + 50);
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

  onClickHome() {
    app.shortcuts.trigger('escape');
    this.hideSidebar();
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
