'use strict';

var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var url= 'http://s13.ru';

var cache = {
    push: function(o) {
        this.data.push(o);
    },
    build: function() {
        this.page = '<html><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><body><ul>';
        for (var i=0; i<this.data.length; i++) {
            this.page = this.page + '<li><a href="' + this.data[i]['url'] + '">' +
                this.data[i]['name'] + '</a> </li>';
        }
        this.page += '</ul></body></html>';
        console.log('--- Cache is built ---');
    }
};

function buildCache() {
    console.log('\n--- Building cache ---\n');
    request(url, function(err, res, body) {
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            cache.data = [];
            $('h3 a','.primary').each(function(i, element) {
                var a= $(element);
                //console.log(a.text());
                if (a.text().match(/^([0-9]+)/) == null){
                    cache.push({name: a.text(), url: a.attr('href')});
                }
            });
            cache.build();
        }
    });
}

buildCache();
setInterval(function() {buildCache();}, 60000);

http.createServer( function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(cache.page);
}).listen('3000', '127.0.0.1');
console.log('--- Server started on http://localhost:3000 ---\n');