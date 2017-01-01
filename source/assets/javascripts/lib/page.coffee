###
 * Based on github.com/visionmedia/page.js
 * Licensed under the MIT license
 * Copyright 2012 TJ Holowaychuk <tj@vision-media.ca>
###

running = false
currentState = null
callbacks = []

@page = (value, fn) ->
  if typeof value is 'function'
    page '*', value
  else if typeof fn is 'function'
    route = new Route(value)
    callbacks.push route.middleware(fn)
  else if typeof value is 'string'
    page.show(value, fn)
  else
    page.start(value)
  return

page.start = (options = {}) ->
  unless running
    running = true
    addEventListener 'popstate', onpopstate
    addEventListener 'click', onclick
    page.replace currentPath(), null, null, true
  return

page.stop = ->
  if running
    running = false
    removeEventListener 'click', onclick
    removeEventListener 'popstate', onpopstate
  return

page.show = (path, state) ->
  return if path is currentState?.path
  context = new Context(path, state)
  currentState = context.state
  page.dispatch(context)
  context.pushState()
  track()
  context

page.replace = (path, state, skipDispatch, init) ->
  context = new Context(path, state or currentState)
  context.init = init
  currentState = context.state
  page.dispatch(context) unless skipDispatch
  context.replaceState()
  track() unless init or skipDispatch
  context

page.dispatch = (context) ->
  i = 0
  next = ->
    fn(context, next) if fn = callbacks[i++]
    return
  next()
  return

page.canGoBack = ->
  not Context.isIntialState(currentState)

page.canGoForward = ->
  not Context.isLastState(currentState)

currentPath = ->
  location.pathname + location.search + location.hash

class Context
  @initialPath: currentPath()
  @sessionId: Date.now()
  @stateId: 0

  @isIntialState: (state) ->
    state.id == 0

  @isLastState: (state) ->
    state.id == @stateId - 1

  @isInitialPopState: (state) ->
    state.path is @initialPath and @stateId is 1

  @isSameSession: (state) ->
    state.sessionId is @sessionId

  constructor: (@path = '/', @state = {}) ->
    @pathname = @path.replace /(?:\?([^#]*))?(?:#(.*))?$/, (_, query, hash) =>
      @query = query
      @hash = hash
      ''

    @state.id ?= @constructor.stateId++
    @state.sessionId ?= @constructor.sessionId
    @state.path = @path

  pushState: ->
    location.replace @path
    # history.pushState @state, '', @path
    return

  replaceState: ->
    try history.replaceState @state, '', @path # NS_ERROR_FAILURE in Firefox
    return

class Route
  constructor: (@path, options = {}) ->
    @keys = []
    @regexp = pathtoRegexp @path, @keys

  middleware: (fn) ->
    (context, next) =>
      if @match context.pathname, params = []
        context.params = params
        fn(context, next)
      else
        next()
      return

  match: (path, params) ->
    return unless matchData = @regexp.exec(path)

    for value, i in matchData[1..]
      value = decodeURIComponent value if typeof value is 'string'
      if key = @keys[i]
        params[key.name] = value
      else
        params.push value
    true

pathtoRegexp = (path, keys) ->
  return path if path instanceof RegExp

  path = "(#{path.join '|'})" if path instanceof Array
  path = path
    .replace /\/\(/g, '(?:/'
    .replace /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (_, slash = '', format = '', key, capture, optional) ->
      keys.push name: key, optional: !!optional
      str = if optional then '' else slash
      str += '(?:'
      str += slash if optional
      str += format
      str += capture or if format then '([^/.]+?)' else '([^/]+?)'
      str += ')'
      str += optional if optional
      str
    .replace /([\/.])/g, '\\$1'
    .replace /\*/g, '(.*)'

  new RegExp "^#{path}$"

onpopstate = (event) ->
  return if not event.state or Context.isInitialPopState(event.state)

  if Context.isSameSession(event.state)
    page.replace(event.state.path, event.state)
  else
    location.reload()
  return

onclick = (event) ->
  try
    return if event.which isnt 1 or event.metaKey or event.ctrlKey or event.shiftKey or event.defaultPrevented
  catch
    return

  link = event.target
  link = link.parentElement while link and link.tagName isnt 'A'

  if link and not link.target and isSameOrigin(link.href)
    # event.preventDefault()
    page.show link.pathname + link.search + link.hash
  return

isSameOrigin = (url) ->
  url.indexOf("#{location.protocol}//#{location.hostname}") is 0

track = ->
  ga?('send', 'pageview', location.pathname + location.search + location.hash)
  _gauges?.push(['track'])
  return