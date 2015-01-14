module.exports = {
  name: 'ember-cli-6to5',
  included: function(app) {
    this._super.included.apply(this, arguments);

    var options = getOptions(app.options['6to5']);

    var plugin = {
      name: 'ember-cli-6to5',
      ext: 'js',
      toTree: function(tree) {
        return require('broccoli-6to5-transpiler')(tree, options);
      }
    };

    app.registry.add('js', plugin);
  }
};

function getOptions(options) {
  options = options || {};

  // Ensure modules aren't compiled unless explicitly set to compile
  options.blacklist = options.blacklist || ['modules'];

  if (options.compileModules === true) {
    if (options.blacklist.indexOf('modules') >= 0) {
      options.blacklist.splice(options.indexOf('modules'), 1);
    }
  } else {
    // Due to a bug in es6-module-transpiler@0.3.6, if there is a singleline
    // comment right after a ES6 module export, it incorrectly consumes the
    // first forward slash, making it a malformed "regexp". This would be rather
    // rare, except that 6to5 currently hoists many inline comments to the
    // bottom of the file! Since most files end with an exported function,
    // this can bite us often. While we work to resolve this, you can turn back
    // comments back on by providing the option in your app's Brocfile:
    // 
    // var app = new EmberApp({
    //   '6to5': {
    //     comments: true
    //   }
    // });
    if (options.comments === undefined) {
      options.comments = false;
    }

    if (options.blacklist.indexOf('modules') < 0) {
      options.blacklist.push('modules');
    }
  }

  // Ember-CLI inserts its own 'use strict' directive
  options.blacklist.push('useStrict');

  return options;
}
