(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;
  app.views.ToTopView = (function(_super) {
    __extends(ToTopView, _super);

    function ToTopView() {
      this.updatePosition = __bind(this.updatePosition, this);
      this.onClick = __bind(this.onClick, this);
      this.onTouchEnd = __bind(this.onTouchEnd, this);
      return ToTopView.__super__.constructor.apply(this, arguments);
    }

    ToTopView.tagName = 'a';

    ToTopView.className = '_totop';

    ToTopView.events = {
      click: 'onClick',
      touchend: 'onTouchEnd'
    };

    ToTopView.prototype.init = function() {
      this.activate();
      this.render();
      return this.bindContentScroll();
    };

    ToTopView.prototype.bindContentScroll = function() {
      var addEventListener, timer;
      this._content = document.documentElement;
      timer = void 0;
      addEventListener = function(el, evt, fn) {
        if (window.addEventListener) {
          el.addEventListener(evt, fn, false);
        } else if (window.attachEvent) {
          el.attachEvent('on' + evt, fn);
        } else {
          el['on' + evt] = fn;
        }
      };
      addEventListener(window, "scroll", (function(_this) {
        return function() {
          timer && clearTimeout(timer);
          return setTimeout(function() {
            return _this.updatePosition();
          }, 50);
        };
      })(this));
      addEventListener(window, "load", (function(_this) {
        return function() {
          return _this.updatePosition();
        };
      })(this));
      return this.updatePosition();
    };

    ToTopView.prototype.render = function() {
      this.el.setAttribute('href', 'javascript:;');
      this.el.setAttribute('title', 'Go to Top');
      return document.body.appendChild(this.el);
    };

    ToTopView.prototype.show = function() {
      return this.el.style.display = 'block';
    };

    ToTopView.prototype.hide = function() {
      return this.el.style.display = 'none';
    };

    ToTopView.prototype.onTouchEnd = function() {
      return this.el.blur();
    };

    ToTopView.prototype.onClick = function() {
      var content;
      this.el.focus();
      content = this._content;
      return $.animate(content, (function(process) {
        return this.scrollTop = process;
      }), content.scrollTop, 0, 500);
    };

    ToTopView.prototype.updatePosition = function() {
      if (this._content.scrollTop > 100) {
        return this.show();
      } else {
        return this.hide();
      }
    };

    return ToTopView;

  })(app.View);

}).call(this);


app.pluginCss('toTop', function() {
  return `
  ._totop {
    z-index: 1050;
    background-image: url(data:image/png;base64,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);
    position: fixed;
    right: 25px;
    bottom: 25px;
    display: none;
    width: 26px;
    height: 48px;
    background-repeat: no-repeat;
    transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out; }
    ._totop:hover {
      background-position: 0 -62px; }
  `
})

app.plugin('toTop', function () {
  return new app.views.ToTopView();
})