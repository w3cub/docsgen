class app.views.ToTopView extends app.View
  @tagName: 'a'
  @className: '_totop'

  @events:
    click: 'onClick'
    touchend: 'onTouchEnd'

  init: ->
    @activate()
    @render()
    @bindContentScroll()
  bindContentScroll: ->
    @_content = document.documentElement
    timer = undefined

    addEventListener = (el, evt, fn) ->
      if window.addEventListener then el.addEventListener(evt, fn, false) else if window.attachEvent then el.attachEvent('on' + evt, fn) else (el['on' + evt] = fn)
      return

    addEventListener window, "scroll", ()  =>
      timer && clearTimeout timer
      setTimeout =>
        @updatePosition()
      , 50
    addEventListener window, "load", ()  =>
      @updatePosition()
    @updatePosition()
  render: ->
    @el.setAttribute 'href', 'javascript:;'
    @el.setAttribute 'title', 'Go to Top'
    document.body.appendChild @el
  show: ->
    @el.style.display = 'block'

  hide: ->
    @el.style.display = 'none'
  onTouchEnd: =>
    # cancel hover status
    @el.blur()
  onClick: =>
    @el.focus()
    content = @_content
    $.animate content, ((process)->
        @scrollTop = process
      ), content.scrollTop, 0, 500

  updatePosition: =>
    if @_content.scrollTop > 100
      @show()
    else
      @hide()

