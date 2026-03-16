/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Cls = (app.views.RootPage = class RootPage extends app.View {
  constructor(...args) {
    this.onClick = this.onClick.bind(this);
    super(...args);
  }

  static initClass() {
    this.events =
      {click: 'onClick'};
  }

  init() {
    if (!this.isHidden()) { this.setHidden(false); } // reserve space in local storage
    this.render();
  }

  render() {
    this.empty();
    if (app.isAndroidWebview()) {
      this.append(this.tmpl('androidWarning'));
    } else {
      this.append(this.tmpl(this.isHidden() ? 'splash' : app.isMobile() ? 'mobileIntro' : 'intro'));
    }
  }

  hideIntro() {
    this.setHidden(true);
    this.render();
  }

  setHidden(value) {
    app.settings.set('hideIntro', value);
  }

  isHidden() {
    return app.isSingleDoc() || app.settings.get('hideIntro');
  }

  onRoute() {}

  onClick(event) {
    if (event.target.hasAttribute('data-hide-intro')) {
      $.stopEvent(event);
      this.hideIntro();
    }
  }
});
Cls.initClass();
