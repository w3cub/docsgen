class app.views.ToTopView extends app.View
  @tagName: 'a'
  @className: '_totop'

  @events:
    click: 'onClick'

  init: ->
    @activate()
    @render()
    setTimeout (=>
      @bindContentScroll()
      ), 200
  bindContentScroll: ->
    @_content = $ '._content'
    @_content.onscroll = (event) => 
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

  onClick: =>
    content = @_content
    $.animate content, ((process)->
        @scrollTop = process
      ), content.scrollTop, 0, 500

  updatePosition: =>
    if @_content.scrollTop > 100
      @show()
    else
      @hide()

