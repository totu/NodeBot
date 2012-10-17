var jsdom = require('jsdom');
var request = require('request');
var url = require('url');

var channel = '#kujalla';

var ircLib = require('irc');
var fs = require('fs');
var client = new ircLib.Client('irc.quakenet.org', 'MorphBot', { 
	channels: [channel], 
});
console.log('Bot running and connected to ' + channel + '...');

var youtube;
var save = [];
var vastaukset;

client.addListener('message', function(from, to, message) {
	
	//Youtube stuff 
	if (message.substring(8,24) == "www.youtube.com/" || message.substring(7,23) == "www.youtube.com/" || message.substring(0,16) == "www.youtube.com/") {
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
				client.say(channel, ircLib.colors.wrap('light_red', youtube));
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
			client.say(channel, 'Available commands: !help,  !hello, !save, !open, !vastaukset');
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
				client.say(channel, ircLib.colors.wrap('light_red', vastaukset));
			}
		}
	} else {
		fs.open('irc.log', 'a', function(e, id) {
			fs.write(id, '<'+from+'> '+message+'\n', null, 'utf8', function() {
				fs.close(id, function(){ });
			});
		});
	}
});

