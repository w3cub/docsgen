require "fileutils"
require "time"

class Sitemap
  def initialize(config = {})
    @fileName = config[:fileName] || "sitemap.xml"
    @fileDir = config[:fileDir] || "./public/"
    @fileBase = config[:fileBase] || @fileDir
    @domain = config[:domain] || "https://docs.w3cub.com/"
    @filePath = "#{@fileDir}#{@fileName}"

    write
  end
  def initfile
    if File.exist?(@filePath)
      File.truncate(@filePath, 0)
    else
      dir = File.dirname(@filePath)
      if File.directory?(dir)
        File.new(@filePath, "a").close
      end
    end

  end

  INCLUDED_EXTENSIONS = %W(
    .htm
    .html
    .xhtml
    .pdf
  ).freeze
  def generate
    # check if filePath exists
    if File.exist?(@filePath)
      # open file
      xmlfile = File.open(@filePath, "a")
      xmlfile.puts '<?xml version="1.0" encoding="UTF-8"?>'
      xmlfile.puts '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
      Dir.glob("#{@fileDir}**/*") do |file|
        next if File.directory? file
        if INCLUDED_EXTENSIONS.include? File.extname(file) 
          lastmod = File.mtime(file).xmlschema
          xmlfile << "<url>\n"
          xmlfile <<  "<loc>#{file.sub(@fileBase,@domain).sub(/\.html$/,"")}</loc>\n"
          xmlfile <<  "<lastmod>#{lastmod}</lastmod>\n"
          xmlfile << "</url>\n"
        end
      end
      xmlfile << "</urlset>"
      xmlfile.close
    end
  end
  def write
    initfile
    generate
  end
end