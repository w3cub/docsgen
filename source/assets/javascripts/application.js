//= require ./vendor/prism
//= require ./vendor/cookies
//= require ./vendor/classlist
//= require ./vendor/mathml

//= require ./lib/util
//= require ./lib/events
//= require ./lib/cookies_store
//= require ./lib/local_storage_store
//= require ./lib/ajax
//= require ./lib/page
//= require ./lib/favicon


//= require app/app
//= require app/settings
//= require app/db
//= require ./app/init
//= require ./app/adblock
//= require ./app/router
//= require ./app/searcher
//= require ./app/shortcuts

//= require collections/collection
//= require_tree ./collections

//= require ./models/model
//= require_tree ./models

//= require ./views/view
//= require ./views/lazyload
//= require_tree ./views/layout
//= require_tree ./views/pages
//= require_tree ./views/list
//= require_tree ./views/search
//= require_tree ./views/sidebar
//= require_tree ./views/widget

//= require ./views/content/content
//= require ./views/content/entry_page

//= require ./templates/base
//= require ./templates/sidebar_tmpl
//= require ./templates/path_tmpl




var init = function() {
  document.removeEventListener('DOMContentLoaded', init, false);

  if (document.body) {
    return app.init();
  } else {
    return setTimeout(init, 42);
  }
};

document.addEventListener('DOMContentLoaded', init, false);
