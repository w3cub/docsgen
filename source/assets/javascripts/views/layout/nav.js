/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Cls = (app.views.Nav = class Nav extends app.View {
  constructor(...args) {
    this.afterRoute = this.afterRoute.bind(this);
    super(...args);
  }

  static initClass() {
    this.el = '._nav';
    this.activeClass = '_nav-current';
  
    this.routes =
      {after: 'afterRoute'};
  }

  select(href) {
    this.deselect();
    if (this.current = this.find(`a[href='${href}']`)) {
      this.current.classList.add(this.constructor.activeClass);
      this.current.setAttribute('tabindex', '-1');
    }
  }

  deselect() {
    if (this.current) {
      this.current.classList.remove(this.constructor.activeClass);
      this.current.removeAttribute('tabindex');
      this.current = null;
    }
  }

  afterRoute(route, context) {
    if (['page', 'offline'].includes(route)) {
      return this.select(context.pathname);
    } else {
      return this.deselect();
    }
  }
});
Cls.initClass();
