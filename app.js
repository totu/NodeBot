var	sys = require('util')
,	irc = require('irc')
, 	jsdom = require('jsdom')
,	request = require('request')
,	url = require('url')
,	grabbedString;

var botname = 'KujaBot';
var channel = '#kujalla';
var Wolfram_API_key = '39KJT4-EUJ8A7U6TA'; //ID for WolframAlpha's API access
var websites = ['youtube.com', 'riemurasia.net'];
var devmode = true;

if (devmode) {channel += "2"; botname += "2";}

var bot = new irc.Client('irc.quakenet.org', botname, {channels: [channel],});
console.log('Bot running and connected to ' + channel + '...');

//Bot stuff
bot.addListener('message', function(from, to, message) {
	if (message.substring(0,botname.length) == botname) {
		if (message.search(new RegExp('hi', 'i')) != -1 || message.search(new RegExp('hello', 'i')) != -1) {
			bot.say(channel, irc.colors.wrap('cyan', 'Hi, ' + from));
		
		} else if (message.search(new RegExp('etsi', 'i')) != -1 || message.search(new RegExp('search', 'i')) != -1) {
			message = message.split(' ').splice(2,message.length);
			var query = message.join('+');
			var url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + query;
			request({uri: url}, function(err, response, body) { 
				var obj = JSON.parse(body);
				var rand = Math.floor(Math.random()*4);
				bot.say(channel, irc.colors.wrap('cyan', obj.responseData.results[rand].url));
			});
		}
		
		else if (message.search(new RegExp('laske', 'i')) != -1 || message.search(new RegExp('calculate', 'i')) != -1)  {
			message = message.split(' ').splice(2,message.length);
			var lauseke = message.join(' ');
			if (lauseke != '' || lauseke != null) {
				var merkki = '+';
				var merkki2 = '%2B';
				for (var i = 0; i < 2; i++) {
					if (i == 1) { merkki = '/'; merkki2 = '%2F'; }
					var intIndexOfMatch = lauseke.indexOf( merkki );
					while (intIndexOfMatch != -1) {
						lauseke = lauseke.replace( merkki, merkki2 );
						intIndexOfMatch = lauseke.indexOf( merkki );
					}
				}
				var wolfurli = "http://api.wolframalpha.com/v2/query?appid=" + Wolfram_API_key + "&format=plaintext&input=" + lauseke; 
				request({uri: wolfurli}, function(err, response, body){ 
					var self = this;
					self.items = new Array();
					if (err) {
						wolfvastaus = "Request error! You done goof'd";
					} else {
						jsdom.env({
							html: body,
							scripts: ['http://code.jquery.com/jquery-latest.min.js']
						}, function(err, window){
							var $ = window.jQuery;
							var wolfvastaus = $('pod:first-child').next().find( $('plaintext') ).html();	
							bot.say(channel, irc.colors.wrap('cyan', wolfvastaus)); 
						});
					}
				});
			}
		}
		
		else {
			bot.say(channel, irc.colors.wrap('cyan', 'Wrong syntax! Use: <botname> <command> <query>'));
		}
	} else {
		for (var i = 0; i < websites.length; i++) {
			var re = new RegExp(websites[i], 'i');
			var search = message.search(re);
			if (search != -1) {
				message = "http://www." + message.substring(search);
				request({uri: message}, function(err, response, body) { 
					var self = this;
					self.items = [];
					if (err) {
						grabbedString = "Request error! You done goof'd";
					} else {
						jsdom.env({ 
							html: body,
							scripts: ['http://code.jquery.com/jquery-latest.min.js']
						}, function(err, window){
							var $ = window.jQuery
							grabbedString = $('title').text();
							bot.say(channel, irc.colors.wrap('cyan', grabbedString));
						});
					}
				});
			}
		}
	}
});