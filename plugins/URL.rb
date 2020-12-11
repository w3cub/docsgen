# case bug for Mozilla Css document

module Jekyll

	class Excerpt
		def initialize(doc)
      self.doc = doc
      self.content = doc.content
    end
	end
end