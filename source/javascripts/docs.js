

$(function() {
    var locapath = location.pathname.split('/').slice(2).join('/') + location.hash;

    function sidebarDoc(doc, options) {
        var link;
        if (options == null) {
            options = {};
        }
        link = "<a href=\"\/" + doc.slug + "\" class=\"_list-item _icon-" + doc.icon + " ";
        link += options.disabled ? '_list-disabled' : '_list-dir';
        link += options.open ? ' open' : '';
        link += "\" data-slug=\"" + doc.slug + "\" title=\"" + doc.name + "\">";
        if (options.disabled) {
            link += "<span class=\"_list-enable\" data-enable=\"" + doc.slug + "\">Enable</span>";
        } else {
            link += "<span class=\"_list-arrow\"></span>";
        }
        if (doc.version) {
            link += "<span class=\"_list-count\">" + doc.version + "</span>";
        }
        return link + (doc.name + "</a>");
    };

    function sidebarType(type, open) {
        open || (open = false);
        return "<a href=\"javascript:;\" title=\"" + type.name + "\" class=\"_list-item _list-dir" + (open ? " open" : "") + "\" data-slug=\"" + type.slug + "\"><span class=\"_list-arrow\"></span><span class=\"_list-count\">" + type.count + "</span>" + type.name + "</a>";
    };

    function realPath(path) {
        return path.replace(/^index(\/)?/, "")
            .replace(/([a-zA-Z0-9-_\.\:]+)?(?:#[a-zA-Z0-9-_\.\:\/\!]+)?$/, function(all, m1) {
                if (all.indexOf("#") != 0)
                    return all.replace(m1, m1 + "/");
                else
                    return all;
            });
    }
    var GUIDES_RGX = /guide|tutorial|reference|getting\s+started/i;
    function _groupFor(type){
        if (GUIDES_RGX.test(type.name)) {
          return 0;
        } else {
          return 1;
        }     
    }
    function sidebarTypes(data) {
        var group, html, i, len, ref, name, result, type;
        var activeEntry = Utils.filter(data.entries, function(item) {
            return realPath(item.path) == locapath
        })[0] || {};
        html = '<div class="_list _list-sub">';
        ref = data.types;
        if (ref.length) {
            result = [];
            for (i = 0, len = ref.length; i < len; i++) {
              type = ref[i];
              (result[name = _groupFor(type)] || (result[name] = [])).push(type);
            }
            ref = [];
            for (i = 0, len = result.length; i < len; i++) {
                if(result[i] && result[i].length){
                    ref = ref.concat(result[i]);
                }
            };
            for (i = 0, len = ref.length; i < len; i++) {
                group = ref[i];
                var isActive = activeEntry.type == group.name;
                html += sidebarType(group, isActive);
                if (isActive)
                    html += sidebarTypeEntrys(group, data.entries)
            }
        } else {
            html += sidebarTypeEntrys({
                name: null
            }, data.entries)
        }
        html += "</div>";
        return html;
    };

    function sidebarTypeEntrys(itemType, entries) {
        var data = Utils.filter(entries, function(item) {
            return item.type == itemType.name
        });
        return sidebarEntrys(data);
    }


    function sidebarEntry(entry, isActive) {
        return "<a href=\"/" + PageConfig["doctype"] + "/" + (realPath(entry.path)) + "\" title=\"" + ($.escape(entry.name)) + "\" class=\"_list-item _list-hover " + (isActive ? "active focus" : "") + "\">" + ($.escape(entry.name)) + "</a>";
    };

    function sidebarEntrys(data) {
        var entry, html, i, len, ref;
        html = '<div class="_list _list-sub">';
        ref = data;
        var co = getCookie('wubalias');
        for (i = 0, len = ref.length; i < len; i++) {
            entry = ref[i];
            var isActive = locapath == realPath(entry.path) && (co ? co == entry.name : true);
            html += sidebarEntry(entry, isActive);
        }
        html += "</div>";
        return html;
    };



    function sidebarResult(entry) {
        return "<a href=\"/" + PageConfig["doctype"] + "/" + realPath(entry.path) + "\" title=\"" + ($.escape(entry.name)) + "\" class=\"_list-item _list-hover _list-result _icon-" + PageConfig.docData.icon + "\"><span class=\"_list-reveal\" data-reset-list title=\"Reveal in list\"></span>" + ($.escape(entry.name)) + "</a>";
    };

    function sidebarResults(data) {
        var html = ""
        for (var i = 0; i < data.length; i++) {
            html += sidebarResult(data[i])
        };
        return html;
    }



    function sidebarNoResults() {
        var html;
        html = " <div class=\"_list-note\">No results.</div> ";
        return html;
    };

    function isNodeTop(target){
        return ~ $(target).attr('class').indexOf("_icon-");
    }


    function getTypeData(callback) {
        if (menuJson) {
            if (!app.docs)
                app.docs = menuJson;
            callback(menuJson);
            return;
        }
        var docsIndex = Store.get(PageConfig.doctype);
        if (docsIndex) {
            callback(docsIndex);
        } else {
            $.ajax({
                    url: PageConfig.doclink,
                    dataType: 'json',
                })
                .done(function(data) {
                    Store.set(PageConfig.doctype, data);
                    app.docs = data;
                    callback(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
        }

    }

    function setCookie(key, value) {
        return $.cookie(key, value, {
            path: "/"
        })
    }

    function getCookie(key) {
        return $.cookie(key)
    }


    function initEvent() {
        var sidebar = $('._sidebar');
        var container = $('._list');
        var searchInput = $('._search-input');
        var searchForm = $('._search');
        var searchClear = $('._search-clear');

        var listDironClick = function(e){
            var target = $(e.currentTarget),
                slug = target.attr('data-slug');
            if (!target.hasClass('open')) {
                getTypeData(function(data) {
                    if (slug == PageConfig.docData.slug && isNodeTop(target)) {
                        target.after(sidebarTypes(data))
                    } else {
                        var itemType = Utils.findWhere(data.types, {
                            slug: slug
                        }) || {};
                        var html = sidebarTypeEntrys(itemType, data.entries);
                        target.after(html);
                    }
                    target.addClass('open');
                })
            } else {
                target.removeClass('open');
                target.siblings('div._list-sub').remove();
            }  
        };
        var listItemonHover = function(event){
            var target = $(event.currentTarget);
            var val = target[0].offsetTop - sidebar[0].scrollTop + target[0].offsetHeight

            setCookie('wubst', val);
            setCookie('wubalias', target.text());

            container.find('._list-hover').removeClass('active focus');
            target.addClass("active").addClass('focus');
            if (location.href.replace(location.origin, "") == target.attr("href") && !searchForm.hasResult) {
                event.preventDefault();
            }
            if (searchForm.hasResult) {
                // location.assign(location.href);
                window.location.reload();
                // searchForm.trigger('clear');
            }
        }

        container.on('click', '._list-dir', function(event) {
            listDironClick(event);
            event.preventDefault();
            event.stopPropagation();
        }).on('click', '._list-hover', function(event) {
            listItemonHover(event);
        });

        var searcher = new app.SynchronousSearcher({
            fuzzy_min_length: 2,
            max_results: app.config.max_results
        });
        searcher.on('results', function(data) {
            if (data.length) {
                searchForm.hasResult = true;
                container.html(sidebarResults(data));
            }
        })
        searcher.on('end', function() {
                if (!searchForm.hasResult) {
                    searchForm.trigger('noresults');
                }
            })
        searchForm.on('searching', function() {
            searchForm.hasResult = null;
            searchForm.addClass('_search-active');
        })
        searchForm.on('clear', function() {
            searchForm.hasResult = null;
            searchForm.removeClass('_search-active');
            getTypeData(function(data) {
                // render
                container.empty();
                container.append(sidebarDoc(PageConfig.docData, {
                    open: true
                }))
                container.append(sidebarTypes(data))
                var currentOffset = $('._list-hover.active').offset();
                if (currentOffset)
                    sidebar.scrollTop(currentOffset.top - (getCookie('wubst') || 200));
                // hightlight
            })
        })

        searchForm.on('noresults', function() {
            container.html(sidebarNoResults());
        })
        var entries;
        searchInput.on('input', function(e) {
            var text = $.trim(e.target.value);
            if (text.length) {
                searchForm.trigger('searching');
                searcher.find(entries.models, 'text', text);
            } else {
                searchForm.trigger('clear');
            }
        })

        searchClear.on('click', function() {
            searchInput.val('');
            searchInput.trigger('input');
        })
        var contentContainer = $('._content');
        contentContainer.on('click', '._pre-clip', function(event) {
            var target = event.currentTarget;
            target.classList.add($.copyToClipboard(target.parentNode.textContent) ? '_pre-clip-success' : '_pre-clip-error');
            setTimeout((function() {
                return target.className = '_pre-clip';
            }), 2000);
        })
        // remove this  after fix content
        contentContainer.find('a').each(function(i, el){
            // fix link
            var href = $(el).attr('href');
            if(href){
                if(!/^http(s)?/.test(href)){
                    if(/^([^#]|\.\.\/)/.test(href)){
                        if(location.pathname != "/" + PageConfig.doctype +"/"){
                            href = "../" + href;
                        }
                    }
                    if(/#/.test(href)){
                        href = href.replace(/(\/[\w-]+)#/, "$1/#");
                    } else if(!/\.htm(l)?/.test(href)){
                        href = href + '/';
                    }
                    $(el).attr('href', href);
                } else {
                    $(el).attr('target', '_blank');
                }
            }
        })


        getTypeData(function(data) {
            // render
            container.append(sidebarDoc(PageConfig.docData, {
                open: true
            }))
            container.append(sidebarTypes(data))
            var currentOffset = $('._list-hover.active').offset();
            if (currentOffset)
                sidebar.scrollTop(currentOffset.top - (getCookie('wubst') || 200));
            // hightlight

            // app.docs = Store.get(PageConfig.doctype);
            entries = new app.collections.Entries(app.docs.entries);
        })
        var _hash = location.hash;
        location.hash = "";
        location.hash = _hash;

        if (document.activeElement !== searchInput[0]) {
          searchInput.focus();
        }
    }


    var findAllByTag = function(tag) {
            return $('._content').find(tag).get();
        },
        findAll = function(all) {
            return findAllByTag(all);
        };
    var getHighlightCode = (function() {
        var highlightCode = function(el, language) {
            var e, i, len;
            if ($.isCollection(el)) {
                for (i = 0, len = el.length; i < len; i++) {
                    e = el[i];
                    highlightCode(e, language);
                }
            } else if (el) {
                el.classList.add("language-" + language);
                Prism.highlightElement(el);
            }
        };
        var jsBase = function() {
                highlightCode(findAllByTag('pre'), 'javascript');
            },
            jswithMarkupCheck = function() {
                var el, i, language, len, ref;
                ref = findAllByTag('pre');
                for (i = 0, len = ref.length; i < len; i++) {
                    el = ref[i];
                    language = el.textContent.match(/^\s*</) ? 'markup' : 'javascript';
                    highlightCode(el, language);
                }
            };
        var LANGUAGE_REGEXP = /brush: ?(\w+)/;
        return {
            angular: function() {
                var el, i, lang, len, ref;
                ref = findAllByTag('pre');
                for (i = 0, len = ref.length; i < len; i++) {
                    el = ref[i];
                    lang = el.classList.contains('lang-html') || el.textContent[0] === '<' ? 'markup' : el.classList.contains('lang-css') ? 'css' : 'javascript';
                    el.setAttribute('class', '');
                    highlightCode(el, lang);
                }
            },
            bower: function() {
                highlightCode(findAll('pre[data-lang="js"], pre[data-lang="javascript"], pre[data-lang="json"]'), 'javascript');
            },
            c: function() {
                highlightCode(findAll('pre.source-c, .source-c > pre'), 'c');
                highlightCode(findAll('pre.source-cpp, .source-cpp > pre'), 'cpp');
            },
            coffeescript: function() {
                highlightCode(findAll('.code > pre:first-child'), 'coffeescript');
                highlightCode(findAll('.code > pre:last-child'), 'javascript');
            },
            d3: function() {
                highlightCode(findAll('.highlight > pre'), 'javascript');
            },
            drupal: function() {
                highlightCode(findAll('pre.php'), 'php');
            },
            ember: function() {
                var el, i, language, len, ref;
                ref = findAllByTag('pre');
                for (i = 0, len = ref.length; i < len; i++) {
                    el = ref[i];
                    language = el.classList.contains('javascript') ? 'javascript' : el.classList.contains('html') ? 'markup' : void 0;
                    if (language) {
                        highlightCode(el, language);
                    }
                }
            },
            go: function() {
                highlightCode(findAll('pre'), 'go');
            },
            chai: jsBase,
            express: jsBase,
            grunt: jsBase,
            lodash: jsBase,
            marionette: jsBase,
            mocha: jsBase,
            modernizr: jsBase,
            moment: jsBase,
            mongoose: jsBase,
            node: jsBase,
            phaser: jsBase,
            q: jsBase,
            rethinkdb: jsBase,
            sinon: jsBase,
            underscore: jsBase,
            webpack: jsBase,
            requirejs: jswithMarkupCheck,
            socketio: jswithMarkupCheck,
            vue: jswithMarkupCheck,
            jquery: function() {
                var _prepare = function() {
                        var el, i, language, len, ref;
                        ref = findAll('.syntaxhighlighter');
                        for (i = 0, len = ref.length; i < len; i++) {
                            el = ref[i];
                            language = el.classList.contains('javascript') ? 'javascript' : 'markup';
                            highlightCode(el, language);
                        }
                    },
                    afterRender = function() {
                        var i, iframe, len, ref;
                        ref = findAllByTag('iframe');
                        for (i = 0, len = ref.length; i < len; i++) {
                            iframe = ref[i];
                            iframe.style.display = 'none';
                            $(iframe).once('load', function(event) {
                                event.target.style.display = '';
                            });
                        }
                        runExamples();
                    },
                    runExamples = function() {
                        var el, i, len, ref;
                        ref = findAll('.entry-example');
                        for (i = 0, len = ref.length; i < len; i++) {
                            el = ref[i];
                            try {
                                runExample(el);
                            } catch (_error) {

                            }
                        }
                    },
                    runExample = function(el) {
                        var doc, iframe, source;
                        source = el.getElementsByClassName('syntaxhighlighter')[0];
                        if (!(source && source.innerHTML.indexOf('!doctype') !== -1)) {
                            return;
                        }
                        if (!(iframe = el.getElementsByClassName('_jquery-demo')[0])) {
                            iframe = document.createElement('iframe');
                            iframe.className = '_jquery-demo';
                            iframe.width = '100%';
                            iframe.height = 200;
                            el.appendChild(iframe);
                        }
                        doc = iframe.contentDocument;
                        doc.write(fixIframeSource(source.textContent));
                        doc.close();
                    },
                    fixIframeSource = function(source) {
                        source = source.replace('"/resources/', '"http://api.jquery.com/resources/');
                        return source.replace('</head>', "<style>\n  html, body { border: 0; margin: 0; padding: 0; }\n  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }\n</style>\n<script>\n  $.ajaxPrefilter(function(opt, opt2, xhr) {\n    if (opt.url.indexOf('http') !== 0) {\n      xhr.abort();\n      document.body.innerHTML = \"<p><strong>This demo cannot run inside DevDocs.</strong></p>\";\n    }\n  });\n</script>\n</head>");
                    };
                _prepare();
                afterRender();
            },
            knockout: function() {
                var el, i, language, len, ref;
                ref = findAll('pre');
                for (i = 0, len = ref.length; i < len; i++) {
                    el = ref[i];
                    language = el.innerHTML.indexOf('data-bind="') > 0 ? 'markup' : 'javascript';
                    highlightCode(el, language);
                }
            },
            laravel: function() {
                highlightCode(findAllByTag('pre'), 'php');
            },
            mdn: function() {
                var el, i, language, len, ref;
                ref = findAll('pre[class^="brush"]');
                for (i = 0, len = ref.length; i < len; i++) {
                    el = ref[i];
                    language = el.className.match(LANGUAGE_REGEXP)[1].replace('html', 'markup').replace('js', 'javascript');
                    el.className = '';
                    highlightCode(el, language);
                }
            },
            meteor: function() {
                highlightCode(findAll('pre.js, pre.javascript'), 'javascript');
                highlightCode(findAll('pre.html'), 'markup');
            },
            phalcon: function() {
                highlightCode(findAll('pre[class*="php"]'), 'php');
                highlightCode(findAll('pre.highlight-html'), 'markup');
            },
            php: function() {
                highlightCode(findAll('.phpcode'), 'php');
            },
            phpunit: function() {
                highlightCode(findAll('pre.programlisting'), 'php');
            },
            rdoc: function() {
                highlightCode(findAll('pre.ruby'), 'ruby');
                highlightCode(findAll('pre.c'), 'clike');
                var toggleEls = findAll('.method-click-advice');
                $(toggleEls).on('click', function(event){
                    var isShown, source;
                    // event.stopPropagation();
                    event.preventDefault();
                    source = $(event.target).parents('.method-detail').find('.method-source-code')[0];
                    isShown = source.style.display === 'block';
                    source.style.display = isShown ? 'none' : 'block';
                    return event.target.textContent = isShown ? 'Show source' : 'Hide source';
                })
            },
            react: function() {
                var el, i, len, ref;
                ref = findAllByTag('pre');
                for (i = 0, len = ref.length; i < len; i++) {
                    el = ref[i];
                    switch (el.getAttribute('data-lang')) {
                        case 'html':
                            highlightCode(el, 'markup');
                            break;
                        case 'javascript':
                        case 'js':
                            highlightCode(el, 'javascript');
                    }
                }
            },
            rust: function() {
                highlightCode(findAll('pre.rust'), 'rust');
            },
            sphinx: function() {
                highlightCode(findAll('pre.python'), 'python');
                highlightCode(findAll('pre.markup'), 'markup');
            }
        };
    })();

    var CLIPBOARD_LINK = '<a class="_pre-clip" title="Copy to clipboard"></a>';
    var addClipboardLinks = function() {
        var el, i, len, ref;
        ref = findAllByTag('pre');
        for (i = 0, len = ref.length; i < len; i++) {
            el = ref[i];
            el.insertAdjacentHTML('afterbegin', CLIPBOARD_LINK);
        }
    };

    var isDocPage = function(){
        return true;
    }

    if(isDocPage()){
        initEvent(); // init event listen
        var useHighlightCode = getHighlightCode[PageConfig.docData.type];
        if (useHighlightCode)
            useHighlightCode();
        addClipboardLinks();
    }
});
