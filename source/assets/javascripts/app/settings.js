/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
(function() {
  let DOCS_KEY = undefined;
  let DARK_KEY = undefined;
  let LAYOUT_KEY = undefined;
  let SIZE_KEY = undefined;
  let TIPS_KEY = undefined;
  const Cls = (app.Settings = class Settings {
    static initClass() {
      DOCS_KEY = 'docs';
      DARK_KEY = 'dark';
      LAYOUT_KEY = 'layout';
      SIZE_KEY = 'size';
      TIPS_KEY = 'tips';
  
      this.defaults = {
        count: 0,
        hideDisabled: false,
        hideIntro: false,
        news: 0,
        manualUpdate: false,
        schema: 1
      };
    }

    constructor() {
      this.store = new CookieStore;
      this.cache = {};
    }

    get(key) {
      let left;
      if (this.cache.hasOwnProperty(key)) { return this.cache[key]; }
      return this.cache[key] = (left = this.store.get(key)) != null ? left : this.constructor.defaults[key];
    }

    set(key, value) {
      this.store.set(key, value);
      delete this.cache[key];
    }

    del(key) {
      this.store.del(key);
      delete this.cache[key];
    }

    hasDocs() {
      try { return !!this.store.get(DOCS_KEY); } catch (error) {}
    }

    getDocs() {
      return __guard__(this.store.get(DOCS_KEY), x => x.split('/')) || app.config.default_docs;
    }

    setDocs(docs) {
      this.set(DOCS_KEY, docs.join('/'));
    }

    getTips() {
      return __guard__(this.store.get(TIPS_KEY), x => x.split('/')) || [];
    }

    setTips(tips) {
      this.set(TIPS_KEY, tips.join('/'));
    }

    setLayout(name, enable) {
      const layout = (this.store.get(LAYOUT_KEY) || '').split(' ');
      $.arrayDelete(layout, '');

      if (enable) {
        if (layout.indexOf(name) === -1) { layout.push(name); }
      } else {
        $.arrayDelete(layout, name);
      }

      if (layout.length > 0) {
        this.set(LAYOUT_KEY, layout.join(' '));
      } else {
        this.del(LAYOUT_KEY);
      }
    }

    hasLayout(name) {
      const layout = (this.store.get(LAYOUT_KEY) || '').split(' ');
      return layout.indexOf(name) !== -1;
    }

    setSize(value) {
      this.set(SIZE_KEY, value);
    }

    dump() {
      return this.store.dump();
    }

    reset() {
      this.store.reset();
      this.cache = {};
    }
  });
  Cls.initClass();
  return Cls;
})();

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}