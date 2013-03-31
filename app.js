var	sys = require('sys')
,	stdin = process.openStdin()
,	jsdom = require('jsdom')
,	request = require('request')
,	url = require('url')	
,	irc = require('irc');

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
	//Grab title from websites in websites array
	for (var i = 0; i < websites.length; i++) { 
		var re = new RegExp(websites[i], 'i'); 
		var search = message.search(re);
		if (search != -1) { 
			message = "http://www." + message.substring(search);
			request({uri: message}, function(err, response, body){ 
				var self = this;
				self.items = [];
				if (err) { grabbedString = "Request error! You done goof'd"; }
				else {
					jsdom.env({ 													
						html: body,
						scripts: ['http://code.jquery.com/jquery-latest.min.js']
					}, function(err, window){
						var $ = window.jQuery;
						grabbedString = $('title').text();
						client.say(channel, ircLib.colors.wrap('cyan', grabbedString));
					});
				}
			});
		}
	}
		
	//WolframAlpha stuff
	if (message.substring(1,5) == 'wolf' || message.substring(1,5) == 'calc' || message.substring(1,5) == 'math') { //If proper command is detected
		var lauseke = message.substring(6);
		//Fix API call URL
		var merkki = '+';
		var merkki2 = '%2B';
		for (var i = 0; i < 2; i++) {
			if (i == 1) {merkki = '/'; merkki2 = '%2F' }
			var intIndexOfMatch = lauseke.indexOf( merkki );
			while (intIndexOfMatch != -1){
				lauseke = lauseke.replace( merkki, merkki2 ) //Replaces '+' with '%2B' and '/' with '%2F'
				intIndexOfMatch = lauseke.indexOf( merkki );
			}
		}
		//Create & make the API call & Grab the proper result
		var wolfurli = "http://api.wolframalpha.com/v2/query?appid=" + AppID + "&format=plaintext&input=" + lauseke; 
		request({uri: wolfurli}, function(err, response, body){ 
			var self = this;
			self.items = new Array();
			if (err && response.statusCode != 200){wolfvastaus = "Request error! You done goof'd";}
			jsdom.env({
				html: body,
				scripts: ['http://code.jquery.com/jquery-latest.min.js']
			}, function(err, window){
				var $ = window.jQuery;
				var wolfvastaus = $('pod:first-child').next().find( $('plaintext') ).html();//= $("pod[title='Result']").find( $('plaintext') ).html(); //Grab paintext under 'Result'
				//var deciapprox = $(pod//$("pod[title='Decimal approximation']").find( $('plaintext') ).html(); //Grab paintext under 'Deciaml approximation'
				//var exactresult = $("pod[title='Exact result']").find( $('plaintext') ).html(); //Grab paintext under 'Exact result'
				if (wolfvastaus == null) var wolfvastaus = deciapprox;
				if (wolfvastaus == null) var wolfvastaus = exactresult;
				client.say(channel, ircLib.colors.wrap('cyan', wolfvastaus)); 
			});
		});
	}
});

