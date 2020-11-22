var app = app ||  {};
app.config = {
    db_filename: "db.json",
    default_docs: ["css", "dom", "dom_events", "html", "http", "javascript"],
    docs_origin: "//docs.w3cub.com",
    env: "production",
    history_cache_size: 10,
    index_filename: "index.json",
    index_path: "/docs",
    max_results: 50,
    production_host: "docs.w3cub.com",
    search_param: "q",
    sentry_dsn: "https://5df3f4c982314008b52b799b1f25ad9d@app.getsentry.com/11245",
    version: 1462140802,
    mathml_stylesheet: "https://cdn.devdocs.io/mathml.css"
}


app.collections = {};
app.models = {};
app.views = {};


~
function(window, undefined) {



    Lazyload.SENCER = 30;
    var noop = function() {};

    // Lazyload Component
    function Lazyload(elements, opts) {
        var self = this;

        this.tag = "data-src";
        this.distance = 0;
        this.callback = noop;
        this._pause = false;

        // mixin
        var opts = opts || {};
        for (var key in opts) {
            this[key] = opts[key];
        }

        this.elements = typeof elements === "string" ? $(elements) : elements;
        this.wrapper = $(this.wrapper)[0] || window;
        setTimeout(function() {
            self.init();
        }, 4);
    };

    // init, bind event
    Lazyload.prototype.init = function() {
        var self = this;
        self._detectElementIfInScreen();

        var timer;
        addEventListener(this.wrapper, "scroll", function() {
            timer && clearTimeout(timer);
            timer = setTimeout(function() {
                self._detectElementIfInScreen();
            }, Lazyload.SENCER);
        });
        addEventListener(window, "resize", function() {
            timer && clearTimeout(timer);
            self._detectElementIfInScreen();
        });
    };

    // detect if in screen
    Lazyload.prototype._detectElementIfInScreen = function() {

        if (!this.elements.length || this._pause) return;

        var W = window.innerWidth || document.documentElement.clientWidth;
        var H = window.innerHeight || document.documentElement.clientHeight;

        for (var i = 0, len = this.elements.length; i < len; i++) {
            var ele = this.elements[i];
            var rect = ele.getBoundingClientRect();
            if ((rect.top >= this.distance && rect.left >= this.distance || rect.top < 0 && (rect.top + rect.height) >= this.distance || rect.left < 0 && (rect.left + rect.width >= this.distance)) && rect.top <= H && rect.left <= W) {
                this.loadItem(ele);
                this.elements.splice(i, 1);
                i--;
                len--;
            }
        }

        if (!this.elements.length) {
            this.callback && this.callback();
        }
    };

    Lazyload.prototype.pause = function() {
        this._pause = true;
        return this;
    };

    Lazyload.prototype.restart = function() {
        this._pause = false;
        this._detectElementIfInScreen();
        return this;
    };

    // lazyload img or script
    Lazyload.prototype.loadItem = function(ele) {
        var imgs = ele.getElementsByTagName("img");
        for (var i = 0, len = imgs.length; i < len; i++) {
            var img = imgs[i];
            var src = img.getAttribute(this.tag);
            if (src) {
                img.setAttribute("src", src);
            }
        }
    };

    // mini Query
    function $(query) {
        var res = [];
        if (document.querySelectorAll) {
            res = document.querySelectorAll(query);
        } else {
            var firstStyleSheet = document.styleSheets[0] || document.createStyleSheet();
            firstStyleSheet.addRule(query, 'Terry:Cai');
            for (var i = 0, len = document.all.length; i < len; i++) {
                var item = document.all[i];
                item.currentStyle.Barret && res.push(item);
            }
            firstStyleSheet.removeRule(0);
        }
        if (res.item) { /* Fuck IE8 */
            var ret = [];
            for (var i = 0, len = res.length; i < len; i++) {
                ret.push(res.item(i));
            }
            res = ret;
        }
        return res;
    };

    function addEventListener(el, evt, fn) {
        window.addEventListener ? el.addEventListener(evt, fn, false) : (window.attachEvent) ? el.attachEvent('on' + evt, fn) : el['on' + evt] = fn;
    }

    window["Lazyload"] = Lazyload;

}(window, void 0);