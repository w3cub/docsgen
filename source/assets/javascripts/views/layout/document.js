/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
(function() {
  let MAX_WIDTH_CLASS = undefined;
  let HIDE_SIDEBAR_CLASS = undefined;
  const Cls = (app.views.Document = class Document extends app.View {
    constructor(...args) {
      this.onSearching = this.onSearching.bind(this);
      this.onSearchClear = this.onSearchClear.bind(this);
      this.onVisibilityChange = this.onVisibilityChange.bind(this);
      super(...args);
    }

    static initClass() {
      MAX_WIDTH_CLASS = '_max-width';
      HIDE_SIDEBAR_CLASS = '_sidebar-hidden';
  
      this.el = document;
  
      this.events =
        {visibilitychange: 'onVisibilityChange'};
  
      this.shortcuts = {
        help:       'onHelp',
        escape:     'onEscape',
        superLeft:  'onBack',
        superRight: 'onForward'
      };
    }

    init() {

    

      this.addSubview((this.nav     = new app.views.Nav),
      this.addSubview(this.sidebar = new app.views.Sidebar));
      // @addSubview @resizer = new app.views.Resizer if app.views.Resizer.isSupported()
      this.addSubview(this.content = new app.views.Content);
      if (!app.isSingleDoc() && !app.isMobile()) { this.addSubview(this.path    = new app.views.Path); }
      this.addSubview(this.totop = new app.views.ToTopView);
      // @sidebar.search
      //   .on 'searching', @onSearching
      //   .on 'clear', @onSearchClear

      $.on(document.body, 'click', this.onClick);

      this.activate();
    }

    toggleLight() {
      const css = $('link[rel="stylesheet"][data-alt]');
      const alt = css.getAttribute('data-alt');
      css.setAttribute('data-alt', css.getAttribute('href'));
      css.setAttribute('href', alt);
      app.settings.setDark(alt.indexOf('dark') > 0);
      if (app.appCache != null) {
        app.appCache.updateInBackground();
      }
    }

    toggleLayout() {
      const wantsMaxWidth = !app.el.classList.contains(MAX_WIDTH_CLASS);
      app.el.classList[wantsMaxWidth ? 'add' : 'remove'](MAX_WIDTH_CLASS);
      app.settings.setLayout(MAX_WIDTH_CLASS, wantsMaxWidth);
      if (app.appCache != null) {
        app.appCache.updateInBackground();
      }
    }

    showSidebar(options) {
      if (options == null) { options = {}; }
      this.toggleSidebar(options, true);
    }

    hideSidebar(options) {
      if (options == null) { options = {}; }
      this.toggleSidebar(options, false);
    }

    toggleSidebar(options, shouldShow) {
      if (options == null) { options = {}; }
      if (shouldShow == null) { shouldShow = options.save ? !this.hasSidebar() : app.el.classList.contains(HIDE_SIDEBAR_CLASS); }
      app.el.classList[shouldShow ? 'remove' : 'add'](HIDE_SIDEBAR_CLASS);
      if (options.save) {
        app.settings.setLayout(HIDE_SIDEBAR_CLASS, !shouldShow);
        if (app.appCache != null) {
          app.appCache.updateInBackground();
        }
      }
    }

    hasSidebar() {
      return !app.settings.hasLayout(HIDE_SIDEBAR_CLASS);
    }

    onSearching() {
      if (!this.hasSidebar()) {
        this.showSidebar();
      }
    }

    onSearchClear() {
      if (!this.hasSidebar()) {
        this.hideSidebar();
      }
    }

    setTitle(title) {}
      // @el.title = if title then "DevDocs - #{title}" else 'DevDocs API Documentation'

    onVisibilityChange() {
      if (this.el.visibilityState !== 'visible') { return; }
      this.delay(function() {
        if (app.isMobile() !== app.views.Mobile.detect()) { location.reload(); }
      }
      , 300);
    }

    onHelp() {
      return app.router.show('/help#shortcuts');
    }

    onEscape() {
      const path = !app.isSingleDoc() || (location.pathname === app.doc.fullPath()) ?
        '/'
      :
        app.doc.fullPath();

      app.router.show(path);
    }

    onBack() {
      history.back();
    }

    onForward() {
      history.forward();
    }

    onClick(event) {
      if (!event.target.hasAttribute('data-behavior')) { return; }
      $.stopEvent(event);
      switch (event.target.getAttribute('data-behavior')) {
        case 'back':         history.back(); break;
        case 'reload':       window.location.reload(); break;
        case 'reboot':       window.location = '/'; break;
        case 'hard-reload':  app.reload(); break;
        case 'reset':        if (confirm('Are you sure you want to reset DevDocs?')) { app.reset(); } break;
      }
    }
  });
  Cls.initClass();
  return Cls;
})();
