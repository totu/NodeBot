var	sys = require('sys')
,	stdin = process.openStdin()
,	jsdom = require('jsdom')
,	request = require('request')
,	url = require('url')
,	youtube
,	save = []
,	quotes = []
,	vastaukset;

var channel = '#kujalla'; /* <-- CHANGE THIS */

var	ircLib = require('irc')
,	fs = require('fs')
,	client = new ircLib.Client('irc.quakenet.org', /* CHANGE THIS --> */ 'KujaBot', { 
		channels: [channel], 
	});
console.log('Bot running and connected to ' + channel + '...');

//Read settings from file
fs.readFile('quotes.bot', function(err, data) {
    if(!err) {
		quotes = data.toString().split("\n");
	}
});

//Bot stuff
stdin.addListener('data', function(d) {
	var	cmd = d.toString().substring(0, d.length-2)
	,	say = d.toString().substring(0,3);
	
	if (cmd == 'down') {
		client.say(channel, 'Shutting down for maintenance...');
	}
	if (cmd == 'hello') {
		client.say(channel, 'Hello again!');
	}
	if (say == 'say') {
		var text = d.toString().substring(4,d.length-2);
		client.say(channel, text);
	}
});

client.addListener('message', function(from, to, message) {
	//Youtube stuff 
	if (message.substring(8,24) == "www.youtube.com/" || message.substring(7,23) == "www.youtube.com/" || message.substring(0,16) == "www.youtube.com/" || message.substring(7,16) == "youtu.be/") {
		if (message.substring(0,3) == "www") {
			message = "http://"+message;
		}
		request({uri: message}, function(err, response, body){
			var self = this;
			self.items = new Array();
			if (err && response.statusCode != 200){youtube = "Request error! You done goof'd";}
			jsdom.env({
				html: body,
				scripts: ['http://code.jquery.com/jquery-latest.min.js']
			}, function(err, window){
				var $ = window.jQuery;
				youtube = $('title').text()
				client.say(channel, ircLib.colors.wrap('cyan', youtube));
				console.log(youtube + ' => ' +message);
			});
		});
	}
	
	//Riemurasia stuff 
	if (message.substring(8,27) == "www.riemurasia.net/" || message.substring(7,26) == "www.riemurasia.net/" || message.substring(0,19) == "www.riemurasia.net/") {
		if (message.substring(0,3) == "www") {
			message = "http://"+message;
		}
		request({uri: message}, function(err, response, body){
			var self = this;
			self.items = new Array();
			if(err && response.statusCode != 200){youtube = "Request error! You done goof'd";}
			jsdom.env({
				html: body,
				scripts: ['http://code.jquery.com/jquery-1.6.min.js']
			}, function(err, window){
				var $ = window.jQuery;
				youtube = $('title').text()
				client.say(channel, ircLib.colors.wrap('cyan', youtube + '- Riemurasia'));
				console.log(youtube + ' => ' +message);
			});
		});
	}


	//Bot stuff
	if (message.charAt(0) == "!") {
		if (message.substring(1,6) == "hello") {
			client.say(channel,'Hi, '+from+'!');
		}
		if (message.substring(1) == "help" || message.substring(1) == "h" || message.substring(1) == "?") {
			client.say(channel, 'Available commands: !help,  !hello, !quote, !quote(x), !save, !open, !vastaukset');
		}
		if (message.substring(1,5) == "save") {
			save.push(message.substring(6));
		}
		if (message.substring(1,5) == "open") {
			client.say(channel,save);
		}
		if (message.substring(1,11) == "vastaukset") {
			if (message.length > 12) {
				vastaukset = message.substring(12);
			} else {
				client.say(channel, ircLib.colors.wrap('yellow', 'Päivän lotto rivi on: ' + vastaukset));
			}
		}
		if (message.substring(1,6) == "quote")  {
			if (message.length == 9) {
				var x = parseFloat(message.substring(7,8));
				if (x > quotes.length || isNaN(x) || x <= 0) {
					client.say(channel, "Error :: Quote ID not found (1-"+quotes.length+")");
				} else {
					client.say(channel, quotes[x-1]);
				}
			} else if (message.length > 7) {
				fs.open('quotes.bot', 'a', function(e, id) {
					fs.write(id, message.substring(7)+'\n', null, 'utf8', function() {
						fs.close(id, function(){ });
					});
				});
				quotes.push(message.substring(7));
			} else {
				client.say(channel, quotes[Math.floor(Math.random()*quotes.length)]);
			}
		}
		//WolframAlpha stuff
		if (message.substring(1,5) == 'wolf' || message.substring(1,5) == 'calc' || message.substring(1,5) == 'math') {
			var lauseke = message.substring(6);
			var wolfurli = 	"http://api.wolframalpha.com/v2/query?appid=39KJT4-EUJ8A7U6TA&format=plaintext&input=" + lauseke;
			request({uri: wolfurli}, function(err, response, body){
				var self = this;
				self.items = new Array();
				if (err && response.statusCode != 200){wolfvastaus = "Request error! You done goof'd";}
				jsdom.env({
					html: body,
					scripts: ['http://code.jquery.com/jquery-latest.min.js']
				}, function(err, window){
					var $ = window.jQuery;
					var wolfvastaus = $("pod[title='Result']").find( $('plaintext') ).html();
					var deciapprox = $("pod[title='Decimal approximation']").find( $('plaintext') ).html();
					var exactresult = $("pod[title='Exact result']").find( $('plaintext') ).html();
					if (wolfvastaus == null) var wolfvastaus = deciapprox;
					if (wolfvastaus == null) var wolfvastaus = exactresult;
					client.say(channel, ircLib.colors.wrap('cyan', wolfvastaus));
					console.log(wolfvastaus + ' => ' +message);
				});
			});
		}
	} else {
		fs.open('irc.log', 'a', function(e, id) {
			fs.write(id, '<'+from+'> '+message+'\n', null, 'utf8', function() {
				fs.close(id, function(){ });
			});
		});
	}
});

