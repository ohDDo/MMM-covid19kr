var NodeHelper = require('node_helper');
var request = require('request');
const convert = require('xml-js');

module.exports = NodeHelper.create({
  start: function () {
    console.log('bitcoin helper started...');
  },

  getTickers: function (url) {
      var self = this;

      request({ url: url, method: 'GET' }, function (error, response, bodyData) {
          if (!error && response.statusCode == 200) {
            var result = bodyData;
            var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
            const jsonData = JSON.parse(xmlToJson);
            self.sendSocketNotification('DATA_RESULT', jsonData);
          }
      });

  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_DATA') {
      this.getTickers(payload);
    }
  }

});