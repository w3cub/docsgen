/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require views/pages/base

(function() {
  let LANGUAGE_RGX = undefined;

  (app.views.GithubPage = class GithubPage extends app.views.BasePage {
    prepare() {
      for (var el of Array.from(this.findAll('pre.highlight'))) {
        this.highlightCode(el, el.className.match(LANGUAGE_RGX)[1]);
      }
    }
  });

  return Cls;
})();
