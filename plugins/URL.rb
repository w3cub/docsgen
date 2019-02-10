# case bug for Mozilla Css document

module Jekyll
  class URL
		def to_s
			sanitize_url(generated_permalink || generated_url)
			# sanitized_url = sanitize_url(generated_permalink || generated_url)
			# if sanitized_url.include?(":")
			#  raise Jekyll::Errors::InvalidURLError,
			#    "The URL #{sanitized_url} is invalid because it contains a colon."
			# else
			#  sanitized_url
			# end
		end
	end
	class Excerpt
		def initialize(doc)
      self.doc = doc
      self.content = doc.content
    end
	end
end