
  // Lazyload Component
  app.views.Lazyload = class Lazyload extends app.View {
    static SENCER = 30;

    static el = "._list";

    static elements = {
      items: "._list-item",
    };

    constructor(opts) {
      super();
      this.tag = "data-src";
      this.distance = 0;
      this.callback = $.noop;
      this._pause = false;

      // mixin
      var opts = opts || {};
      for (var key in opts) {
        this[key] = opts[key];
      }
    }
    init() {
      this.activate();
    }
    activate() {
      if (super.activate(...arguments)) {
        this._detectElementIfInScreen();

        this._onScroll = () => {
          this._timer && clearTimeout(this._timer);
          this._timer = setTimeout(() => {
            this._detectElementIfInScreen();
          }, Lazyload.SENCER);
        };

        this._onResize = () => {
          this._timer && clearTimeout(this._timer);
          this._detectElementIfInScreen();
        };

        $.on(window, "scroll", this._onScroll);
        $.on(window, "resize", this._onResize);
      }
    }
    deactivate() {
      if (super.deactivate(...arguments)) {
        $.off(window, "scroll", this._onScroll);
        $.off(window, "resize", this._onResize);
        this._timer && clearTimeout(this._timer);
      }
    }

    // detect if in screen
    _detectElementIfInScreen() {
      if (!this.items?.length || this._pause) return;

      var W = window.innerWidth || document.documentElement.clientWidth;
      var H = window.innerHeight || document.documentElement.clientHeight;

      for (var i = 0, len = this.items.length; i < len; i++) {
        var ele = this.items[i];
        var rect = ele.getBoundingClientRect();
        if (
          ((rect.top >= this.distance && rect.left >= this.distance) ||
            (rect.top < 0 && rect.top + rect.height >= this.distance) ||
            (rect.left < 0 && rect.left + rect.width >= this.distance)) &&
          rect.top <= H &&
          rect.left <= W
        ) {
          this.loadItem(ele);
          this.items.splice(i, 1);
          i--;
          len--;
        }
      }

      if (!this.items.length) {
        this.callback && this.callback();
      }
    }

    pause() {
      this._pause = true;
      return this;
    }

    restart() {
      this._pause = false;
      this._detectElementIfInScreen();
      return this;
    }

    // lazyload img or script
    loadItem(ele) {
      var imgs = ele.getitemsByTagName("img");
      for (var i = 0, len = imgs.length; i < len; i++) {
        var img = imgs[i];
        var src = img.getAttribute(this.tag);
        if (src) {
          img.setAttribute("src", src);
        }
      }
    }
  };
 
