/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
(function() {
  let SEARCH_PARAM = undefined;
  let HASH_RGX = undefined;
  const Cls = (app.views.Search = class Search extends app.View {
    constructor(...args) {
      this.autoFocus = this.autoFocus.bind(this);
      this.onReady = this.onReady.bind(this);
      this.onInput = this.onInput.bind(this);
      this.searchUrl = this.searchUrl.bind(this);
      this.google = this.google.bind(this);
      this.stackoverflow = this.stackoverflow.bind(this);
      this.onResults = this.onResults.bind(this);
      this.onEnd = this.onEnd.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onRoot = this.onRoot.bind(this);
      this.afterRoute = this.afterRoute.bind(this);
      super(...args);
    }

    static initClass() {
      SEARCH_PARAM = app.config.search_param;
  
      this.el = '._search';
      this.activeClass = '_search-active';
  
      this.elements = {
        input:     '._search-input',
        resetLink: '._search-clear'
      };
  
      this.events = {
        input:  'onInput',
        click:  'onClick',
        submit: 'onSubmit'
      };
  
      this.shortcuts = {
        typing: 'autoFocus',
        altG: 'google',
        altS: 'stackoverflow'
      };
  
      this.routes = {
        root: 'onRoot',
        after: 'afterRoute'
      };
  
      HASH_RGX = new RegExp(`^#${SEARCH_PARAM}=(.*)`);
    }

    init() {
      this.addSubview(this.scope = new app.views.SearchScope(this.el));

      this.searcher = new app.Searcher;
      this.searcher
        .on('results', this.onResults)
        .on('end', this.onEnd);

      app.on('ready', this.onReady);
      $.on(window, 'hashchange', this.searchUrl);
      $.on(window, 'focus', this.autoFocus);
    }

    focus() {
      this.delay(() => {
        if (document.activeElement !== this.input) { return this.input.focus(); }
      });
    }

    autoFocus() {
      if (!$.isTouchScreen()) {
        if (document.activeElement !== this.input) { this.input.focus(); }
      }
    }

    reset() {
      this.el.reset();
      this.onInput();
      this.autoFocus();
    }

    disable() {
      this.input.setAttribute('disabled', 'disabled');
    }

    enable() {
      this.input.removeAttribute('disabled');
    }

    onReady() {
      this.value = '';
      this.delay(this.onInput);
    }

    onInput() {
      if ((this.value == null) || // ignore events pre-"ready"
                (this.value === this.input.value)) { return; }
      this.value = this.input.value;

      if (this.value.length) {
        this.search();
      } else {
        this.clear();
      }
    }

    search(url) {
      if (url == null) { url = false; }
      this.addClass(this.constructor.activeClass);
      this.trigger('searching');

      this.hasResults = null;
      this.flags = {urlSearch: url, initialResults: true};
      this.searcher.find(this.scope.getScope().entries.all(), 'text', this.value);
    }

    searchUrl() {
      let value;
      if (app.router.isRoot()) {
        this.scope.searchUrl();
      }
      // else if not app.router.isDocIndex()
      //   return

      if (!(value = this.extractHashValue())) { return; }
      this.input.value = (this.value = value);
      this.input.setSelectionRange(value.length, value.length);
      this.search(true);
      return true;
    }

    clear() {
      this.removeClass(this.constructor.activeClass);
      this.trigger('clear');
    }

    externalSearch(url) {
      let value;
      if (value = this.value) {
        if (this.scope.name()) { value = `${this.scope.name()} ${value}`; }
        $.popup(`${url}${encodeURIComponent(value)}`);
        this.reset();
      }
    }

    google() {
      this.externalSearch("https://www.google.com/search?q=");
    }

    stackoverflow() {
      this.externalSearch("https://stackoverflow.com/search?q=");
    }

    onResults(results) {
      results = results.filter(e => e.path !== "javascript:;");
      if (results.length) { this.hasResults = true; }
      this.trigger('results', results, this.flags);
      this.flags.initialResults = false;
    }

    onEnd() {
      if (!this.hasResults) { this.trigger('noresults'); }
    }

    onClick(event) {
      if (event.target === this.resetLink) {
        $.stopEvent(event);
        this.reset();
        this.focus();
      }
    }

    onSubmit(event) {
      $.stopEvent(event);
    }

    onRoot(context) {
      if (!context.init) { this.reset(); }
    }

    afterRoute(name, context) {
      if (context.hash) { this.delay(this.searchUrl); }
      return this.autoFocus();
    }

    extractHashValue() {
      let value;
      if ((value = this.getHashValue()) != null) {
        app.router.replaceHash();
        return value;
      }
    }

    getHashValue() {
      try { return __guard__(HASH_RGX.exec($.urlDecode(location.hash)), x => x[1]); } catch (error) {}
    }
  });
  Cls.initClass();
  return Cls;
})();

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}