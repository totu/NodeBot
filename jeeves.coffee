irc = require 'irc'
sys = require 'util'
req = require 'request'
cheerio = require 'cheerio'

name = 'KujaBot'
channel = '#kujalla'
websites = ['www.youtube.com', 'www.riemurasia.net', 'www.reddit.com', 'news.ycombinator.com']
cmd = null

Jeeves = new irc.Client 'irc.quakenet.org', name, {channels: [channel]}
console.log sys.format '%s connecting to %s...', name, channel

Jeeves.get = (str, msg) ->
  str = str.split ' '
  for s in str
    if msg.search(new RegExp('!'+s, 'i')) != -1
      cmd = '!'+s
      return true
  return false

Jeeves.talk = (str) ->
  Jeeves.say channel, irc.colors.wrap 'cyan', str

Jeeves.find = (pic) ->
  req {uri: 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + pic.split(' ').join('+')}, (err, res, body) ->
    if !err
      obj = JSON.parse body
      Jeeves.talk obj.responseData.results[0].url if obj.responseData.results.length > 0

Jeeves.title_please = (vid) ->
  for site in websites
    if vid.search(new RegExp(site, 'i')) != -1
      v = sys.format 'http://%s', vid.substring(vid.search(new RegExp(site, 'i')))
      req {uri: v}, (err, res, body) ->
        if err
          Jeeves.talk 'You done goof\'d!'
        else
          $ = cheerio.load(body)
          console.log $('title').text()
          Jeeves.talk $('title').text()

Jeeves.addListener 'message', (from, to, msg) ->
  Jeeves.talk sys.format 'Hello, %s, my good chum', from if Jeeves.get 'hi hello', msg
  Jeeves.find msg.replace cmd, '' if Jeeves.get 'search find etsi kuva picture pic image img', msg
  Jeeves.title_please msg
