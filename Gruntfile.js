
module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    jsx: {
      build: {
        src: "sample/main.jsx",
        dest: "main.js",
        add_search_path: ["src", "nodejs.jsx/lib"],
        executable : "node",
      },
      test: {
        src: grunt.option('target') || 't/**/*.jsx',
        add_search_path: ["src", "nodejs.jsx/lib"],
        executable : "node",
        test : true,
      },
    },
  });

  grunt.loadNpmTasks("grunt-jsx");

  grunt.registerTask('default', ['jsx:test']);
}
