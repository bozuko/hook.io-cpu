var Hook = require('hook.io').Hook,
    util = require('util'),
    os = require('os');

var defaults = {
    poll_time: 20000,
    load_threshold: 2.5
};

var  Cpu = module.exports = function (options) {

  Hook.call(this, options);

  var self = this;

  self.poll_time = self.config.get('poll_time') || defaults.poll_time;
  self.load_threshold = self.config.get('load_threshold') || defaults.load_threshold;

  this.on('cpu::alert', function(data) {
      console.log('cpu alert: '+inspect(data)); 
  });

  this.on('hook::ready', function () {
    setInterval(function() {
        var oneminavg = os.loadavg()[0];
        if (oneminavg > self.load_threshold) {
            self.emit('alert', {host: os.hostname(), oneminavg: oneminavg});
        }
    }, self.poll_time);
  });
};

//
// Inherit from `hookio.Hook`
//
util.inherits(Cpu, Hook);
