desc 'compile kube.css'
file 'css/kube.css' => Dir['sass/*'] do |t|
  sh "sass sass/kube.scss > #{t.name}"
end

desc 'compile kube.min.css'
file 'css/kube.min.css' => Dir['sass/*'] do |t|
  sh "sass -t compressed sass/kube.scss > #{t.name}"
end

task :default => ['css/kube.css', 'css/kube.min.css']
