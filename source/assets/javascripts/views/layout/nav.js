(app.views.Nav = class Nav extends app.View {
  constructor(...args) {
    this.afterRoute = this.afterRoute.bind(this);
    super(...args);
  }

  el = '._nav';
  activeClass = '_nav-current';
  routes = {after: 'afterRoute'};

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
