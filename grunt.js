/*global module:false, console:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:gdda.jquery.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 
          '<file_strip_banner:src/<%= pkg.name %>.js>',
          '<file_strip_banner:src/<%= pkg.name %>.util.js>',
          '<file_strip_banner:src/<%= pkg.name %>.core.option.js>',
          '<file_strip_banner:src/<%= pkg.name %>.core.module.js>',
          '<file_strip_banner:src/<%= pkg.name %>.core.querybox.js>',
          '<file_strip_banner:src/<%= pkg.name %>.core.querybox.ctrls.js>',
          '<file_strip_banner:src/<%= pkg.name %>.core.js>'],
        dest: 'dist/<%= pkg.name %>.src.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      urls:[
        'http://localhost:8000/test/core.option_load.html',
        'http://localhost:8000/test/core.module.html',
        'http://localhost:8000/test/core.querybox.html',
        'http://localhost:8000/test/core.querybox.query.html'/*,
        'http://localhost:8000/test/gdda.html'*/
      ]
      
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: ['<config:lint.files>','test/*.html','ajax/**/*.js','ajax/**/*.json','libs/lib-loader.js'],
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint server qunit concat min');
  grunt.registerTask('dev', 'server watch');
  //grunt.registerTask('mintest', 'lint concat min server qunit');

};
