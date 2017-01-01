#Docshub
A Jekyll Project



##Jekyll Case

> ... is invalid because it contains a colon https://github.com/jekyll/jekyll/issues/5261


You should go to path `ruby-2.*.*/gems/jekyll-3.*.*/lib/jekyll/url.rb`, comment the code like the following:

    def to_s
      sanitize_url(generated_permalink || generated_url)
      # sanitized_url = sanitize_url(generated_permalink || generated_url)
      # if sanitized_url.include?(":")
      #   raise Jekyll::Errors::InvalidURLError,
      #     "The URL #{sanitized_url} is invalid because it contains a colon."
      # else
      #   sanitized_url
      # end



##Release

	rake setup_gen # setup generate queue
 	rake multi_gen_deploy # project release

 
