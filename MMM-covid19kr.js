'use strict';

Module.register("MMM-covid19Kr", {

  result: {},
  defaults: {
    //fiat: 'usd',
    //showBefore: null,
    //exchange: 'bitstamp',
    updateInterval: 60000,

    // Used to work out url and symbols
    /*fiatTable: {
      usd: {
        symbol: '$',
        exchangeCode: 'btcusd'
      },
      eur: {
        symbol: '€',
        exchangeCode: 'btceur'
      }
    }*/
  },

  getStyles: function() {
    return ["MMM-covid19Kr.css"];
  },

  start: function() {
    this.getData();
    this.scheduleUpdate();
  },

  getDom: function() {
    var wrapper = document.createElement("data");
    wrapper.className = 'medium bright';
    wrapper.className = 'data';

    var jsonData = this.result;
    /*Busan Data Setting*/
    var BusanData = jsonData.response.body.items.item[16];
    var Busan = BusanData.gubun._text;
    var BusanIncDec = BusanData.incDec._text; //전날대비증감수
    var BusanIsolIngCnt = BusanData.isolIngCnt._text; //확진자수(격리중)
    /*수도권 Data Setting*/
    //서울
    var CapData = jsonData.response.body.items.item[17];
    var CapIncDec = parseInt(CapData.incDec._text);
    var CapIsolIngCnt = parseInt(CapData.isolIngCnt._text);
    //인천
    CapData = jsonData.response.body.items.item[14];
    CapIncDec += parseInt(CapData.incDec._text);
    CapIsolIngCnt += parseInt(CapData.isolIngCnt._text);
    //경기
    CapData = jsonData.response.body.items.item[9];
    CapIncDec += parseInt(CapData.incDec._text);
    CapIsolIngCnt += parseInt(CapData.isolIngCnt._text);

    var Cap = "수도권";
    /*전국 Data Setting*/
    var TotData = jsonData.response.body.items.item[18];
    var Tot = "전국";
    var TotIncDec = parseInt(TotData.incDec._text);
    var TotIsolIngCnt = parseInt(TotData.isolIngCnt._text);

    var symbolElement =  document.createElement("span");
    //var exchange = this.config.exchange;
    //var fiat = this.config.fiat;
    //var fiatSymbol = this.config.fiatTable[fiat].symbol;
    //var lastPrice = data.last;
    
    symbolElement.innerHTML = `${Busan} 신규확진자수: ${BusanIncDec}`;
    wrapper.appendChild(symbolElement);
    var priceElement = document.createElement("span");
    priceElement.innerHTML = `${Busan} 확진자(격리중)수: ${BusanIsolIngCnt}`;
    wrapper.appendChild(priceElement);
  
    return wrapper;
  },

  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setInterval(function() {
      self.getData();
    }, nextLoad);
  },

  getData: function () {
    //var fiat = this.config.fiat;
    var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=LPop7%2BJKBqEO%2FLV6BpvCmfS8j3ErPq3yYZMEDPW6jX6oYI%2BxBSBwRtzCPOD12%2BBbXdxhyQgWFxGu%2B4sjIfYS6w%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    url= url + queryParams;
    this.sendSocketNotification('GET_DATA', url);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "DATA_RESULT") {
      var self = this;
      this.result = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

});
