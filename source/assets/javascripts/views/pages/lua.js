//= require views/pages/base

app.views.LuaPage = class LuaPage extends app.views.BasePage {
  prepare() {
    this.highlightCode(this.findAllByTag('pre'), 'lua');
  }
};
