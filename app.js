var	sys = require('util')
,	irc = require('irc')
, 	jsdom = require('jsdom')
,	request = require('request')
,	url = require('url')
,	mail = require('emailjs')
,	crypto = require('crypto')
, 	mongojs = require('mongojs')
,	db = mongojs('irc', ['users'])
,	authed = []
,	grabbedString;

var botname = '';
var channel = '';
var Wolfram_API_key = ''; //ID for WolframAlpha's API access
var websites = ['youtube.com', 'riemurasia.net'];
var mailuser = '';
var mailpass = '';
var mailhost = '';
var devmode = false;

if (devmode) {channel += "2"; botname += "2";}

var bot = new irc.Client('irc.quakenet.org', botname, {channels: [channel],});
console.log('Bot running and connected to ' + channel + '...');

//Bot stuff
bot.addListener('message', function(from, to, message) {
	if (message.substring(0,botname.length) == botname) {
		if (message.search(new RegExp('etsi', 'i')) != -1 || message.search(new RegExp('search', 'i')) != -1) {
			message = message.split(' ').splice(2,message.length);
			var query = message.join('+');
			var url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + query;
			request({uri: url}, function(err, response, body) { 
				var obj = JSON.parse(body);
				var rand = Math.floor(Math.random()*4);
				bot.say(channel, obj.responseData.results[rand].url);
			});
		}
		
		else if (message.search(new RegExp('wiki', 'i')) != -1) {
			message = message.split(' ').splice(2,message.length);
			var query = message.join('+');
			var url = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + query;
			request({uri: url}, function(err, response, body) { 
				var obj = JSON.parse(body);
				bot.say(channel, 'https://en.wikipedia.org/wiki/' + obj[1][0]);
			});
		}
		
		else if (message.search(new RegExp('laske', 'i')) != -1 || message.search(new RegExp('calculate', 'i')) != -1) {
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
				request({uri: wolfurli}, function(err, response, body) { 
					var self = this;
					self.items = new Array();
					if (err) {
						wolfvastaus = "Request error! You done goof'd";
					} else {
						jsdom.env({
							html: body,
							scripts: ['http://code.jquery.com/jquery-latest.min.js']
						}, function(err, window) {
							var $ = window.jQuery;
							var wolfvastaus = $('pod:first-child').next().find( $('plaintext') ).html();
							if (wolfvastaus == null || wolfvastaus == '') bot.say(channel,'Sorry, but that was just too fuck\'d up for me to show you.');
							else bot.say(channel, wolfvastaus); 
						});
					}
				});
			}
		}
		
		else if (message.search(new RegExp('I am a pirate', 'i')) != -1) {
			for (a in authed) {
				if (authed[a][0] == from) {
					bot.say(channel, "Do what you want, 'cause a Pirate is free! You are a Pirate!");
					db.users.update({"name":authed[a][1]}, {$set:{"pirate":"true"}}, {multi:true} , function(err) {});
				}
			}
		} 
		
		else if (message.search(new RegExp('pirate', 'i')) != -1) {
			for (a in authed) {
				if (authed[a][0] == from) {
					db.users.find({"name":authed[a][1]}, function(err, docs) {
						if (docs[0]['pirate'] == 'true') {
							message = message.split(' ').splice(2,message.length);
							var query = message.join('+');
							var url = 'http://apify.ifc0nfig.com/tpb/search?id=' + query;
							request({uri: url}, function(err, response, body) { 
								var obj = JSON.parse(body);
								bot.say(channel, obj[0]['name']);
								bot.say(channel, obj[0]['magnet']);
							});
						}
					});
				}
			}
		}
		
		else if (message.search(new RegExp('mail', 'i')) != -1) {
			var text = message.split(' ').splice(4,message.length).join(' ');
			var to = message.split(' ').splice(2,1);
			var subject = message.split(' ').splice(3,1);
			if (message.split(' ').length >= 5) {
			
				var server  = mail.server.connect({
				   user: mailuser, 
				   password: mailpass, 
				   host: mailhost, 
				   ssl: true
				});
				
				server.send({
					   text: text, 
					   from: "KujaBot <Kujis@kujalla.com", 
					   to: "<" + to + ">",
					   subject: subject
					}, function(err, message) {
						if (err) bot.say(channel, err);
						else bot.say(channel, 'Sent that for ya\''); 
				});
			} else {
				bot.say(channel, 'You must be new here, proper usage should look something like this: <botname> mail <to> <subject> <text>'); 
			}
		}
		
		else if (message.search(new RegExp('hi', 'i')) != -1 || message.search(new RegExp('hello', 'i')) != -1) {
			bot.say(channel, 'Hi, ' + from);
		}
		
		else {
			bot.say(channel, 'I don\'t have a clue what you are trying to do, here are some instructions: <botname> <command> <query>');
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
							bot.say(channel, grabbedString);
						});
					}
				});
			}
		}
	}
});

bot.addListener('pm', function (from, message) {
	bot.whois(from, function(whois) {
		message = message.replace(/\s+/g, ',').split(',');
		if (whois['channels'].join(' ').search(new RegExp('@' + channel, 'i')) != -1) {
			if (message[0].toString().search(new RegExp('register', 'i')) != -1) {
				console.log('new reg');
				db.users.insert( { "name" : message[1] , "password" : crypto.createHash("sha1").update(message[2]).digest("hex") } );
			}
		}
			
		if (message[0].toString().search(new RegExp('login', 'i')) != -1) {
			db.users.find( { "name" : message[1] , "password" : crypto.createHash("sha1").update(message[2]).digest("hex") }, function(err, docs) {
				if (authed.join(' ').search(new RegExp(from + ',' + docs[0]['name'], 'i')) != true) {
					var a = new Array(from, docs[0]['name']);
					authed.push(a);
				}
				bot.send('MODE', channel, '+o', from);
			});
		}	
	});
});

bot.addListener('part', function (channel, nick, reason, message) {
	for (a in authed) {
		if (authed[a][0] == nick) {
			authed.splice(a, 1);
		}
	}
});

process.stdin.on('data', function (data) {
	var a = data.toString().split(' ');
	if (a[0] == 'say') {
		a.splice(0,1);
		bot.say(channel, a.join(' ').replace(/\n+/g, '')); 
	}
});
