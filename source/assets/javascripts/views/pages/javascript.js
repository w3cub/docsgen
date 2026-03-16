/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require views/pages/base

app.views.JavascriptPage = class JavascriptPage extends app.views.BasePage {
  prepare() {
    this.highlightCode(this.findAllByTag('pre'), 'javascript');
  }
};

app.views.JavascriptWithMarkupCheckPage = class JavascriptWithMarkupCheckPage extends app.views.BasePage {
  prepare() {
    for (var el of Array.from(this.findAllByTag('pre'))) {
      var language = el.textContent.match(/^\s*</) ?
        'markup'
      :
        'javascript';
      this.highlightCode(el, language);
    }
  }
};

app.views.GruntPage =
app.views.JavascriptPage;

app.views.DojoPage =
(app.views.RequirejsPage =
app.views.JavascriptWithMarkupCheckPage);
