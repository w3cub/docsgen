require "rubygems"
require "bundler/setup"
require "stringex"
require "fileutils"
require "./sitemap"

## -- Rsync Deploy config -- ##
# Be sure your public key is listed in your server's ~/.ssh/authorized_keys file
ssh_user       = "user@domain.com"
ssh_port       = "22"
document_root  = "~/website.com/"
rsync_delete   = false
rsync_args     = ""  # Any extra arguments to pass to rsync
deploy_default = "push"

# This will be configured for you when you run config_deploy
deploy_branch  = "gh-pages"

## -- Misc Configs -- ##

public_dir      = "public"    # compiled site directory
source_dir      = "source"    # source file directory
blog_index_dir  = 'source'    # directory for your blog's index page (if you put your index in source/blog/index.html, set this to 'source/blog')
deploy_dir      = "_deploy"   # deploy directory (for Github pages deployment)
stash_dir       = "_stash"    # directory to stash posts for speedy generation
posts_dir       = "_posts"    # directory for blog files
themes_dir      = ".themes"   # directory for blog files
new_post_ext    = "markdown"  # default new post file extension when using the new_post task
new_page_ext    = "markdown"  # default new page file extension when using the new_page task
server_port     = "4000"      # port for preview server eg. localhost:4000
docs_dir        = "_docs"
docs_cache_dir  = ".docs-cache"


repo_url = "git@github.com:w3cub/docshub-release-201708.git"

if (/cygwin|mswin|mingw|bccwin|wince|emx/ =~ RUBY_PLATFORM) != nil
  puts '## Set the codepage to 65001 for Windows machines'
  `chcp 65001`
end


#######################
# Working with Jekyll #
#######################

desc "Generate jekyll site"
task :generate do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "## Generating Site with Jekyll"
  # system "compass compile --css-dir #{source_dir}/stylesheets"
  system "JEKYLL_ENV=production jekyll build --incremental"
end

desc "Watch the site and regenerate when it changes"
task :watch do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "Starting to watch source with Jekyll and Compass."
  system "compass compile --css-dir #{source_dir}/stylesheets" unless File.exist?("#{source_dir}/stylesheets/screen.css")
  jekyllPid = Process.spawn({"OCTOPRESS_ENV"=>"preview"}, "jekyll build --watch")
  # compassPid = Process.spawn("compass watch")

  trap("INT") {
    [jekyllPid
      # , compassPid
      ].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [jekyllPid
    # , compassPid
    ].each { |pid| Process.wait(pid) }
end

desc "preview the site in a web browser"
task :preview do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "Starting to watch source with Jekyll and Compass. Starting Rack on port #{server_port}"
  # system "compass compile --css-dir #{source_dir}/stylesheets" unless File.exist?("#{source_dir}/stylesheets/screen.css")
  jekyllPid = Process.spawn({"OCTOPRESS_ENV"=>"preview"}, "jekyll build --watch")
  # compassPid = Process.spawn("compass watch")
  rackupPid = Process.spawn("rackup --host 0.0.0.0  --port #{server_port}")

  trap("INT") {
    [jekyllPid, 
      # compassPid, 
      rackupPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [jekyllPid, 
    # compassPid, 
    rackupPid].each { |pid| Process.wait(pid) }
end

desc "badlink docs html"
task :badlink do |t, args|
  scount = 0
  Dir.glob("#{docs_cache_dir}/**/*.html") { |dir|
    arr  = dir.split("/").reverse()
    if arr[0] && arr[0].index("_") == 0
      scount += 1
      spath = Pathname.new(dir.sub("\.docs-cache", "#{source_dir}/#{docs_dir}"))
      pdirname = spath.dirname
      FileUtils.mkdir_p(pdirname)
      FileUtils.cp_r(dir, pdirname)
      puts dir.sub("\.docs-cache\/", " - ")
    end 
  }
  puts "total: #{scount}"  
end

desc "Clean out caches: .pygments-cache, .gist-cache, .sass-cache"
task :clean do
  rm_rf [Dir.glob(".pygments-cache/**"), Dir.glob(".gist-cache/**"), Dir.glob(".sass-cache/**"), "source/stylesheets/screen.css"]
end


##############
# Deploying  #
##############

desc "Default deploy task"
task :deploy do
  # Check if preview posts exist, which should not be published
  if File.exists?(".preview-mode")
    puts "## Found posts in preview mode, regenerating files ..."
    File.delete(".preview-mode")
    Rake::Task[:generate].execute
  end

  Rake::Task[:copydot].invoke(source_dir, public_dir)
  Rake::Task["#{deploy_default}"].execute
end

desc "Generate website and deploy"
task :gen_deploy => [:generate, :deploy] do
end



desc "Copy docs html to website, if debug param is set, only copy a part of docs"
task :copy_html, :names do |t, args|
  args.with_defaults(:names=> '')
  names = args[:names]
  (Dir["#{source_dir}/#{docs_dir}/*"]).each { |f| rm_rf(f) }
  if names.is_a?(String) && names.match(/(\w+\|?\s?)*?/)
    names = names.split(" ")
    names.each { |name|  
        target_path = "#{source_dir}/#{docs_dir}/#{name}"
        mkdir_p(target_path)
        cp_r("#{docs_cache_dir}/#{name}/.", target_path)
    }
  end
end

desc "test preview"
task :test_preview do |t, args|
  Rake::Task[:copy_html].invoke('backbone')
  Rake::Task[:preview].invoke
end


task "reinit git"
task :gitinit do |t, args|
  rm_rf deploy_dir
  mkdir deploy_dir
  cd "#{deploy_dir}" do
    system "git init"
    system 'echo "W3cubDocs is upgrading " > index.html'
    system "git add ."
    system "git commit -m \"W3cubDocs init\""
    system "git branch -m gh-pages"
    system "git remote add origin #{repo_url}"
  end
  Rake::Task[:gen_deploy].invoke

  Rake::Task[:gen_deploy].reenable
  Rake::Task[:deploy].reenable
  Rake::Task[:generate].reenable
  Rake::Task[:copydot].reenable
  Rake::Task["#{deploy_default}"].reenable

end

task "setup generate collection"
task :setup_gen do
  names = []
  content = ""
  Dir.glob("#{docs_cache_dir}/*") { |dir|  
    names.push dir.gsub('.docs-cache/','')
  }
  names.sort.each_with_index { |item, index|
    if index%2 == 0
      if index == 0
        content << "[\n'"
      else
        content << "',\n'"
      end
    end
    content << item + " "
    if index == names.size - 1
      content << "'\n]"
    end
  }
  rakefile = IO.read(__FILE__)
  rakefile.sub!(/queueNames([\n\s]*?)=([\s\n]*?)((\[)[^\]]*?(\]))/, "queueNames\\1=\\2#{content}")
  File.open(__FILE__, 'w') do |f|
    f.write rakefile
  end
end


desc "This task for big Collection"
task :multi_gen_deploy do 
  # Rake::Task[:gitinit].invoke
  queueNames = 
[
'angular angularjs~1.6 ',
'angular~2 ansible ',
'apache_http_server apache_pig~0.17 ',
'async backbone ',
'bootstrap~3 bootstrap~4 ',
'bottle~0.12 bower ',
'browser_support_tables c ',
'cakephp~3.4 chai ',
'chef~12 clojure~1.7 ',
'clojure~1.8 cmake~3.9 ',
'codeception codeceptjs ',
'codeigniter~3 coffeescript ',
'cordova~7 cpp ',
'crystal css ',
'd3~4 django~1.11 ',
'docker~1.13 dojo ',
'dom dom_events ',
'electron elixir~1.5 ',
'ember erlang~20 ',
'express falcon~1.2 ',
'fish~2.6 flow ',
'gcc~7 gcc~7_cpp ',
'git gnu_fortran~7 ',
'go godot~2.1 ',
'grunt haskell~7 ',
'haskell~8 haxe ',
'haxe~cpp haxe~cs ',
'haxe~flash haxe~java ',
'haxe~javascript haxe~neko ',
'haxe~php haxe~python ',
'html http ',
'immutable influxdata ',
'jasmine javascript ',
'jest jquery ',
'jquerymobile jqueryui ',
'julia~0.6 knockout ',
'kotlin laravel~4.2 ',
'laravel~5.4 less ',
'liquid lodash~4 ',
'love lua~5.3 ',
'marionette~2 marionette~3 ',
'markdown matplotlib~1.5 ',
'matplotlib~2.0 meteor~1.5 ',
'minitest mocha ',
'modernizr moment ',
'mongoose nginx ',
'nginx_lua_module node ',
'node~4_lts node~6_lts ',
'nokogiri npm ',
'numpy~1.13 openjdk~8 ',
'openjdk~8_gui openjdk~8_web ',
'opentsdb padrino ',
'pandas~0.20 perl~5.26 ',
'phalcon~2 phalcon~3 ',
'phaser phoenix ',
'php phpunit~6 ',
'postgresql~9.6 pug ',
'python~2.7 python~3.6 ',
'q rails~5.1 ',
'ramda react ',
'react_native redis ',
'redux relay ',
'requirejs rethinkdb~java ',
'rethinkdb~javascript rethinkdb~python ',
'rethinkdb~ruby ruby~2.4 ',
'rust sass ',
'scikit_image scikit_learn ',
'sinon~1 sinon~2 ',
'socketio sqlite ',
'statsmodels svg ',
'symfony~3.3 tcl_tk ',
'tensorflow~cpp tensorflow~guide ',
'tensorflow~python twig~1 ',
'twig~2 typescript ',
'underscore vagrant ',
'vue~1 vue~2 ',
'webpack webpack~1 ',
'xslt_xpath yarn ',
'yii~1.1 yii~2.0 '
]

  queue = Queue.new
  queueNames.each do |item|
    queue.push(item)
  end

  until queue.empty?
    docs = queue.pop rescue nil
    puts docs
    Rake::Task[:copy_html].invoke(docs)
    Rake::Task[:copy_html].reenable
    Rake::Task[:gen_deploy].invoke

    Rake::Task[:gen_deploy].reenable
    Rake::Task[:deploy].reenable
    Rake::Task[:generate].reenable
    Rake::Task[:copydot].reenable
    Rake::Task["#{deploy_default}"].reenable

    sleep 1
  end
  # Thread.new do
  # end
  puts "All Deploy Complete"
end

desc "generate sitemap"
task :sitemap do |t, args|
  names = []
  Dir.glob("#{docs_cache_dir}/*") { |dir|  
    names.push dir.gsub('.docs-cache/','')
  }
  queue = Queue.new
  names.each do |item|
    queue.push(item)
  end
  until queue.empty?
    docs = queue.pop rescue nil
    puts "Generating #{docs} sitemap"
    Sitemap.new({fileDir: "./_deploy/"+ docs + '/', fileBase: "./_deploy/"})
  end
  robotfile = "./public/robots.txt"
  if File.exists?(robotfile)
    File.truncate(robotfile, 0)
  else
    File.new(robotfile, "a").close
  end
  puts "Updating robots"
  robots = File.open(robotfile, "a")
  robots.puts "User-agent: *"
  robots.puts "Disallow: "
  names.each do |item|
    robots.puts "Sitemap: http://docs.w3cub.com/#{item}/sitemap.xml"
  end
end


desc "copy dot files for deployment"
task :copydot, :source, :dest do |t, args|
  FileList["#{args.source}/**/.*"].exclude("**/.", "**/..", "**/.jekyll-metadata", "**/.DS_Store", "**/._*").each do |file|
    cp_r file, file.gsub(/#{args.source}/, "#{args.dest}") unless File.directory?(file)
  end
end


desc "deploy public directory to github pages"
multitask :push do
  puts "## Deploying branch to Github Pages "
  # puts "## Pulling any updates from Github Pages "
  # cd "#{deploy_dir}" do 
  #   Bundler.with_clean_env { system "git pull" }
  # end
  # (Dir["#{deploy_dir}/*"]).each { |f| rm_rf(f) }
  # Rake::Task[:copydot].invoke(public_dir, deploy_dir)
  # puts "\n## Copying #{public_dir} to #{deploy_dir}"
  # cp_r "#{public_dir}/.", deploy_dir

  # commitdir = "#{deploy_dir}"
  # FileUtils.cd(commitdir) do |path|
  #   dir = File.join(File.dirname(__FILE__), path, "*")
  #   subdir = File.join(File.dirname(__FILE__), path)
  #   Dir[dir].each { |x|
  #     if FileTest.directory?(x)
  #       cmdir = x.sub(File.join(File.dirname(__FILE__), commitdir, "/"), "")
  #       # puts x
  #       puts "\n add directory #{cmdir}"
  #       system "git add -A #{cmdir}/"
  #       message = "Site updated #{cmdir} directory at #{Time.now.utc}"
  #       puts "\n## Committing: #{message}"
  #       system "git commit -m \"#{message}\""
  #       puts "\n## Pushing generated #{cmdir} website"
  #       Bundler.with_clean_env { system "git push origin #{deploy_branch}" }
  #       puts "\n## Github Pages deploy complete"
  #     end
  #   }
  #   puts "\n add directory #{commitdir}"
  #   system "git add -A ."
  #   message = "Site updated #{commitdir} directory at #{Time.now.utc}"
  #   puts "\n## Committing: #{message}"
  #   system "git commit -m \"#{message}\""
  #   puts "\n## Pushing generated #{commitdir} website"
  #   Bundler.with_clean_env { system "git push origin #{deploy_branch}" }
  #   puts "\n## Github Pages deploy complete"
  # end
  Rake::Task[:copydot].invoke(public_dir, deploy_dir)
  puts "\n## Copying #{public_dir} to #{deploy_dir}"
  cp_r "#{public_dir}/.", deploy_dir
  cd "#{deploy_dir}" do
    system "git add -A"
    message = "Site updated at #{Time.now.utc}"
    puts "\n## Committing: #{message}"
    system "git commit -m \"#{message}\""
    puts "\n## Pushing generated #{deploy_dir} website"
    Bundler.with_clean_env { system "git push origin #{deploy_branch}" }
    puts "\n## Github Pages deploy complete"
  end

  puts "continue"

end

desc "Deploy website via rsync"
task :rsync do
  exclude = ""
  if File.exists?('./rsync-exclude')
    exclude = "--exclude-from '#{File.expand_path('./rsync-exclude')}'"
  end
  puts "## Deploying website via Rsync"
  ok_failed system("rsync -avze 'ssh -p #{ssh_port}' #{exclude} #{rsync_args} #{"--delete" unless rsync_delete == false} #{public_dir}/ #{ssh_user}:#{document_root}")
end



desc "Update configurations to support publishing to root or sub directory"
task :set_root_dir, :dir do |t, args|
  puts ">>> !! Please provide a directory, eg. rake config_dir[publishing/subdirectory]" unless args.dir
  if args.dir
    if args.dir == "/"
      dir = ""
    else
      dir = "/" + args.dir.sub(/(\/*)(.+)/, "\\2").sub(/\/$/, '');
    end
    rakefile = IO.read(__FILE__)
    rakefile.sub!(/public_dir(\s*)=(\s*)(["'])[\w\-\/]*["']/, "public_dir\\1=\\2\\3public#{dir}\\3")
    File.open(__FILE__, 'w') do |f|
      f.write rakefile
    end
    compass_config = IO.read('config.rb')
    compass_config.sub!(/http_path(\s*)=(\s*)(["'])[\w\-\/]*["']/, "http_path\\1=\\2\\3#{dir}/\\3")
    compass_config.sub!(/http_images_path(\s*)=(\s*)(["'])[\w\-\/]*["']/, "http_images_path\\1=\\2\\3#{dir}/images\\3")
    compass_config.sub!(/http_fonts_path(\s*)=(\s*)(["'])[\w\-\/]*["']/, "http_fonts_path\\1=\\2\\3#{dir}/fonts\\3")
    compass_config.sub!(/css_dir(\s*)=(\s*)(["'])[\w\-\/]*["']/, "css_dir\\1=\\2\\3public#{dir}/stylesheets\\3")
    File.open('config.rb', 'w') do |f|
      f.write compass_config
    end
    jekyll_config = IO.read('_config.yml')
    jekyll_config.sub!(/^destination:.+$/, "destination: public#{dir}")
    jekyll_config.sub!(/^subscribe_rss:\s*\/.+$/, "subscribe_rss: #{dir}/atom.xml")
    jekyll_config.sub!(/^root:.*$/, "root: /#{dir.sub(/^\//, '')}")
    File.open('_config.yml', 'w') do |f|
      f.write jekyll_config
    end
    rm_rf public_dir
    mkdir_p "#{public_dir}#{dir}"
    puts "## Site's root directory is now '/#{dir.sub(/^\//, '')}' ##"
  end
end

desc "Set up _deploy folder and deploy branch for Github Pages deployment"
task :setup_github_pages, :repo do |t, args|
  if args.repo
    repo_url = args.repo
  else
    puts "Enter the read/write url for your repository"
    puts "(For example, 'git@github.com:your_username/your_username.github.io.git)"
    puts "           or 'https://github.com/your_username/your_username.github.io')"
    repo_url = get_stdin("Repository url: ")
  end
  protocol = (repo_url.match(/(^git)@/).nil?) ? 'https' : 'git'
  if protocol == 'git'
    user = repo_url.match(/:([^\/]+)/)[1]
  else
    user = repo_url.match(/github\.com\/([^\/]+)/)[1]
  end
  branch = (repo_url.match(/\/[\w-]+\.github\.(?:io|com)/).nil?) ? 'gh-pages' : 'master'
  project = (branch == 'gh-pages') ? repo_url.match(/([^\/]+?)(\.git|$)/i)[1] : ''
  unless (`git remote -v` =~ /origin.+?octopress(?:\.git)?/).nil?
    # If octopress is still the origin remote (from cloning) rename it to octopress
    system "git remote rename origin octopress"
    if branch == 'master'
      # If this is a user/organization pages repository, add the correct origin remote
      # and checkout the source branch for committing changes to the blog source.
      system "git remote add origin #{repo_url}"
      puts "Added remote #{repo_url} as origin"
      system "git config branch.master.remote origin"
      puts "Set origin as default remote"
      system "git branch -m master source"
      puts "Master branch renamed to 'source' for committing your blog source files"
    else
      unless !public_dir.match("#{project}").nil?
        system "rake set_root_dir[#{project}]"
      end
    end
  end
  url = blog_url(user, project, source_dir)
  jekyll_config = IO.read('_config.yml')
  jekyll_config.sub!(/^url:.*$/, "url: #{url}")
  File.open('_config.yml', 'w') do |f|
    f.write jekyll_config
  end
  rm_rf deploy_dir
  mkdir deploy_dir
  cd "#{deploy_dir}" do
    system "git init"
    system 'echo "My Octopress Page is coming soon &hellip;" > index.html'
    system "git add ."
    system "git commit -m \"Octopress init\""
    system "git branch -m gh-pages" unless branch == 'master'
    system "git remote add origin #{repo_url}"
    rakefile = IO.read(__FILE__)
    rakefile.sub!(/deploy_branch(\s*)=(\s*)(["'])[\w-]*["']/, "deploy_branch\\1=\\2\\3#{branch}\\3")
    rakefile.sub!(/deploy_default(\s*)=(\s*)(["'])[\w-]*["']/, "deploy_default\\1=\\2\\3push\\3")
    File.open(__FILE__, 'w') do |f|
      f.write rakefile
    end
  end
  puts "\n---\n## Now you can deploy to #{repo_url} with `rake deploy` ##"
end

def ok_failed(condition)
  if (condition)
    puts "OK"
  else
    puts "FAILED"
  end
end

def get_stdin(message)
  print message
  STDIN.gets.chomp
end

def ask(message, valid_options)
  if valid_options
    answer = get_stdin("#{message} #{valid_options.to_s.gsub(/"/, '').gsub(/, /,'/')} ") while !valid_options.include?(answer)
  else
    answer = get_stdin(message)
  end
  answer
end

def blog_url(user, project, source_dir)
  cname = "#{source_dir}/CNAME"
  url = if File.exists?(cname)
    "http://#{IO.read(cname).strip}"
  else
    "http://#{user.downcase}.github.io"
  end
  url += "/#{project}" unless project == ''
  url
end

desc "list tasks"
task :list do
  puts "Tasks: #{(Rake::Task.tasks - [Rake::Task[:list]]).join(', ')}"
  puts "(type rake -T for more detail)\n\n"
end
