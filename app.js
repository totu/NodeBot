var	sys = require('util'),
    irc = require('irc'),
    cheerio = require('cheerio'),
    request = require('request'),
    url = require('url'),
    command = '',
    result = '';

var botname = 'KujaBot';
var channel = '#kujalla';
var Wolfram_API_key = '39KJT4-EUJ8A7U6TA'; //ID for WolframAlpha's API access
var websites = ['youtube.com', 'riemurasia.net'];
var devmode = false;

if (devmode) {channel += "2"; botname += "2";}

var bot = new irc.Client('irc.quakenet.org', botname, {channels: [channel],});
console.log('Bot running and connected to ' + channel + '...');

//Bot stuff

function talk(s){
  bot.say(channel, irc.colors.wrap('cyan', s));
}

function botmsg(s,m){
  for (var i=0;i<s.length;i++){
    if (m.search(new RegExp('!'+s[i], 'i')) != -1) {
      command = '!'+s[i];
      return true
    }
  }
  return false
}

bot.addListener('message', function(from, to, message) {
  if (botmsg(['hi','hello'], message)) {
    talk('Hi, ' + from);
  } else if (botmsg(['search','find','etsi'], message)) {
    var msg = message.replace(command,'').split(' ');
    url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + msg.join('+');
    request({uri: url}, function(err, res, body) {
      var obj = JSON.parse(body);
      talk(obj.responseData.results[0].url);
    });
  } else if (botmsg(['math','wolf','calc','calculate','laske'], message)) {
    var msg = message.replace(command,'').split(' '),
    q = msg.join(' ');
    if (q != '' || q != null) {
      var m = '+',
      m2 = '%2B';
      for (var i=0;i<2;i++) {
        if (i==1) { m='/'; m='%2F'; }
        var iom = q.indexOf(m);
        while (iom != -1) {
          q = q.replace(m, m2);
          iom = q.indexOf(m);
        }
      }
      var wolframurl = 'http://api.wolframalpha.com/v2/query?appid=' + Wolfram_API_key + '&format=plaintext&input=' + q;
      request({uri: wolframurl}, function(err, res, body) {
        if (err) {
          result = 'Something went wrong.';
        } else {
          $ = cheerio.load(body);
          result = $('pod:first-child').next().find($('plaintest')).html();
          if (result == null || result == '') talk('Sorry, but that was just way too fuck\'d up for me to show here..');
          else talk(result)
        }
      });
    }
  } else {
    for (var i=0;i<websites.length;i++) {
      var reg = new RegExp(websites[i], 'i'), src = message.search(reg);
      if (src != -1) {
        var msg = 'http://www.' + message.substring(src);
        request({uri: msg}, function(err, res, body) {
          if (err) {
            result = 'You done goof\'d, son!';
          } else {
            $ = cheerio.load(body);
            result = $('title').text();
            /*jsdom.env({
              html: body,
              scripts: ['http://code.jquery.com/jquery-latest.min.js'],
              done: function(err, window) {
                var $ = window.jQuery;
                result = $('title').text();
              }
            });*/
          }
          console.log(result);
          talk(result);
        });
      }
    }
  }
});
