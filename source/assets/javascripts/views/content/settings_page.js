/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
(function() {
  let LAYOUTS = undefined;
  let SIDEBAR_HIDDEN_LAYOUT = undefined;
  const Cls = (app.views.SettingsPage = class SettingsPage extends app.View {
    constructor(...args) {
      this.onChange = this.onChange.bind(this);
      super(...args);
    }

    static initClass() {
      LAYOUTS = ['_max-width', '_sidebar-hidden', '_native-scrollbars'];
      SIDEBAR_HIDDEN_LAYOUT = '_sidebar-hidden';
  
      this.className = '_static';
  
      this.events =
        {change: 'onChange'};
    }

    render() {
      this.html(this.tmpl('settingsPage', this.currentSettings()));
    }

    currentSettings() {
      const settings = {};
      settings.dark = app.settings.get('dark');
      settings.smoothScroll = !app.settings.get('fastScroll');
      settings.arrowScroll = app.settings.get('arrowScroll');
      for (var layout of Array.from(LAYOUTS)) { settings[layout] = app.settings.hasLayout(layout); }
      return settings;
    }

    getTitle() {
      return 'Preferences';
    }

    toggleDark(enable) {
      const css = $('link[rel="stylesheet"][data-alt]');
      const alt = css.getAttribute('data-alt');
      css.setAttribute('data-alt', css.getAttribute('href'));
      css.setAttribute('href', alt);
      app.settings.set('dark', !!enable);
      if (app.appCache != null) {
        app.appCache.updateInBackground();
      }
    }

    toggleLayout(layout, enable) {
      if (layout !== SIDEBAR_HIDDEN_LAYOUT) { document.body.classList[enable ? 'add' : 'remove'](layout); }
      document.body.classList[$.overlayScrollbarsEnabled() ? 'add' : 'remove']('_overlay-scrollbars');
      app.settings.setLayout(layout, enable);
      if (app.appCache != null) {
        app.appCache.updateInBackground();
      }
    }

    toggleSmoothScroll(enable) {
      app.settings.set('fastScroll', !enable);
    }

    toggle(name, enable) {
      app.settings.set(name, enable);
    }

    onChange(event) {
      const input = event.target;
      switch (input.name) {
        case 'dark':
          this.toggleDark(input.checked);
          break;
        case 'layout':
          this.toggleLayout(input.value, input.checked);
          break;
        case 'smoothScroll':
          this.toggleSmoothScroll(input.checked);
          break;
        default:
          this.toggle(input.name, input.checked);
      }
    }

    onRoute(context) {
      this.render();
    }
  });
  Cls.initClass();
  return Cls;
})();
