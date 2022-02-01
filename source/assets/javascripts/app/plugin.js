
var app = app || {};
var _plugins = {};
var jsprefix = '/js/plugins/';

// append the string html to the body
app.pluginHtml = function (name, fn) {
  var body = document.getElementsByTagName("body")[0];
  var div = document.createElement("template");
  div.innerHTML = fn();
  body.appendChild(div.content.cloneNode(true));
}
// append the style to the body
app.pluginCss = function (name, fn) {
  var head = document.getElementsByTagName("head")[0] || document.documentElement;
  var style = document.createElement("style");
  style.id = name;
  style.innerHTML = fn();
  head.appendChild(style);
}
/**
 * @param {*} name 
 * @param {*} fn
 */
app.plugin = function (name, fn) {
  _plugins[name] = {
    execute: fn
  }
  app.on('pluginReady' + name, function() {
    _plugins[name].execute()
  })
}

// load plugin by script url
app.loadPlugin = function (url, callback) {
  var head = document.getElementsByTagName("head")[0] || document.documentElement;
  var script = document.createElement("script");
  script.src = url;
  var done = false;
  script.onload = script.onreadystatechange = function () {
    
    if (!done && (!this.readyState ||
      this.readyState === "loaded" || this.readyState === "complete")) {
      done = true;
      script.onload = script.onreadystatechange = null;
      if (head && script.parentNode) {
        head.removeChild(script);
      }
      callback && callback()
    }
  };
  head.insertBefore(script, head.firstChild);
}
app.on('ready', () => {
  fetch('/conf/plugins.json?_=' + Date.now())
  .then(res => res.json()).then(res => {
    if (res.plugins) {
      // dynamic load the js plugins
      for (var key in res.plugins) {
        if (!res.plugins[key].action) {
          continue;
        }
        var only = res.plugins[key].only || '';
        if (only && only != app.router.context.pathname) {
          continue;
        }
        var exclude = res.plugins[key].exclude || '';
        if (exclude && exclude == app.router.context.pathname) {
          continue;
        }
        // scope wrapper for plugin
        (function(key){
          var plugin = res.plugins[key];
          var url = jsprefix + plugin.import;
          if (plugin.hash) {
            url += '?_=' + plugin.hash;
          }
          app.loadPlugin(url, function () {
            app.trigger('pluginReady' + key);
          })
        })(key);
      }
    }
  })
})