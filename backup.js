//Requiring dependencies & variables
var	sys = require('sys')
,	stdin = process.openStdin()
//,	jsdom = require('jsdom')
,	request = require('request')
,	url = require('url')
,	ircLib = require('irc')
,	fs = require('fs')
,	grabbedString
,	save = []
,	quotes = []
,	channelops = []
,	vastaukset;

var channel = '#kujalla';
var botname = 'KujaBot';
var AppID = '39KJT4-EUJ8A7U6TA'; //ID for WolframAlpha's API access
var websites = ['youtube.com', 'riemurasia.net'];
var devmode = true;

//Creating the actual IRC client part
if (devmode) {channel += "2"; botname += "2";}
var client = new ircLib.Client('irc.quakenet.org', botname, {channels: [channel],});
console.log('Bot running and connected to ' + channel + '...');

//Read settings from file
fs.readFile('quotes.bot', function(err, data) { //Open 'quotes.bot' file
    if(!err) quotes = data.toString().split("\n"); //Add the content of the file into 'quotes' array
});
fs.readFile('ops.bot', function(err, data) {
    if(!err) channelops = data.toString().split("\n");
});
fs.readFile('vastaukset.bot', function(err, data) {
    if(!err) vastaukset = data.toString();
});

//Bot stuff
stdin.addListener('data', function(d) {	//Adding a listener to standard input
	var say = d.toString().substring(0,3);	//Grabbing first 3 characters
	if (say == 'say') {	//If grabbed characters are "say"
		var text = d.toString().substring(4,d.length-2);	//Grab rest of the string
		client.say(channel, text);	//And say it to the IRC channel
	}
});

//PM stuff
client.addListener('pm', function (from, message) {
	var str = channelops.indexOf(from);
	if (str > -1 && message == '!opme')
		client.send('MODE', channel, '+o', from);
	if (str > -1 && message.substring(0,6) == '!addop') {
		fs.open('ops.bot', 'a', function(e, id) { 
			fs.write(id, message.substring(7)+'\n', null, 'utf8', function() {
				fs.close(id, function(){ }); 
			});
		});
		channelops.push(message.substring(6));
	}
	if (message == '!ops') {console.log(channelops);}
	if (message == '!logs') {
		fs.readFile('irc.log', function(err, data) {
			if (err) {
				client.say(from, err);
			} else {
				var logs = data.toString().split('\n');
				for (var i = logs.length-15; i < logs.length; i++) {
					client.say(from, logs[i]);
				}
			}
		});
	}
});

//Channel stuff
client.addListener('message', function(from, to, message) { //Adding a listener for messages from the IRC channel
	//Website grab stuff
	for (var i = 0; i < websites.length; i++) { //For each in websites
		var re = new RegExp(websites[i], 'i'); //Make a new Regular Expression
		var search = message.search(re); //Search message for said RegExp
		if (search != -1) { //If RegExp is found
			message = "http://www." + message.substring(search); //Add missing "http://www." infront of the string
			request({uri: message}, function(err, response, body){ 	//Request handler
				var self = this; //Add the site to 'self' variable
				self.items = []; //Make array out of items in self
				if (err && response.statusCode != 200){grabbedString = "Request error! You done goof'd";} //If page doesn't return 200 (OK) code, report error.
				jsdom.env({ 													//Enstablish jsdom environment
					html: body,													//Include body as html
					scripts: ['http://code.jquery.com/jquery-latest.min.js']	//Include latest jquery as script
				}, function(err, window){
					var $ = window.jQuery
					grabbedString = $('title').text() //Grab site's title
					client.say(channel, ircLib.colors.wrap('cyan', grabbedString)); //Broadcast site's title to the IRC channel with 'cyan' color
					console.log(grabbedString + ' => ' +message);  //And log the event in console
				});
			});
		}
	}
	
	//Bot command stuff
	if (message.charAt(0) == "!") { //If channel message starts with "!" => message is a command
		if (message.substring(1,6) == "hello") //If command is "hello"
			client.say(channel,'Hi, '+from+'!'); //Respond with "Hi, sender"
		if (message.substring(1) == "help" || message.substring(1) == "h" || message.substring(1) == "?") //If command is for help, h or ?
			client.say(channel, 'Available commands: !help, !hello, !calc, !math, !wolf, !quote, !quote(x), !save, !open, !vastaukset'); //Respond with a simple list of commands
		if (message.substring(1,5) == "save") //If save command
			save.push(message.substring(6)); //Save following message to save array
		if (message.substring(1,5) == "open") //if open command
			client.say(channel,save); //Respond with content of save array
			
		if (message.substring(1,11) == "vastaukset") { //If vastaukset command
			if (message.length > 12) {//Check if there is message after the command
				vastaukset = message.substring(12); //Add the message to vastaukset variable
				fs.open('vastaukset.bot', 'w', function(e, id) { //Open 'quote.bot' file in append mode (if file exists message will be added to a new row, if file does not exist it will be created)
					fs.write(id, message.substring(12), null, 'utf8', function() {  //Write the message to the 'vastaukset.bot' file
						fs.close(id, function(){ }); //Close the file
					});
				});
			} else
				client.say(channel, ircLib.colors.wrap('yellow', 'Päivän lotto rivi on: ' + vastaukset)); //Else respond with vastaukset variable		
		}
		
		if (message.substring(1,6) == "quote")  { //If quote command
			if (message.length == 9) { //Check if used !quote(<number>) command or not
				var x = parseFloat(message.substring(7,8)); //Parse the number
				if (x > quotes.length || isNaN(x) || x <= 0) //If parse isn't in ID range
					client.say(channel, "Error :: Quote ID not found (1-"+quotes.length+")"); //Respond with an error message
				else
					client.say(channel, quotes[x-1]); //Else respond with the proper quote
			} else if (message.length > 7) { //Check if quote is folloed with a message
				fs.open('quotes.bot', 'a', function(e, id) { //Open 'quote.bot' file in append mode (if file exists message will be added to a new row, if file does not exist it will be created)
					fs.write(id, message.substring(7)+'\n', null, 'utf8', function() {  //Write the message to the 'quote.bot' file
						fs.close(id, function(){ }); //Close the file
					});
				});
				quotes.push(message.substring(7)); //Push the message into quotes array for temporary storrage and usage
			} else {
				client.say(channel, quotes[Math.floor(Math.random()*quotes.length)]); //Else respond with a random quote from the quotes array
			}
		}
		//WolframAlpha stuff
		if (message.substring(1,5) == 'wolf' || message.substring(1,5) == 'calc' || message.substring(1,5) == 'math') { //If proper command is detected
			var lauseke = message.substring(6); //Grab the math command
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
			var wolfurli = 	"http://api.wolframalpha.com/v2/query?appid=" + AppID + "&format=plaintext&input=" + lauseke; 
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
					if (wolfvastaus == null) var wolfvastaus = deciapprox; //If no 'Result' present use 'Decimal approximation'
					if (wolfvastaus == null) var wolfvastaus = exactresult; //if no 'Decimal approxmation' preset use 'Exact result' 
					client.say(channel, ircLib.colors.wrap('cyan', wolfvastaus)); //Respond with the answer to the query with "cyan" color
					console.log(wolfvastaus + ' => ' +message); //And log the event into console log
				});
			});
		}
	} else { //If received message doesn't start with "!" i.e. it's not a command
		fs.open('irc.log', 'a', function(e, id) { //Open 'irc.log' file with append mode
			fs.write(id, '<'+from+'> '+message+'\n', null, 'utf8', function() { //And write '<sender> message' into the file
				fs.close(id, function(){ }); //Close the file
			});
		});
	}
});

