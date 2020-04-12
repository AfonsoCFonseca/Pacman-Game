var express = require('express')
var path = require( 'path' )
var app = express()


var port = process.env.PORT || 8080;

app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));

app.get('/', function(req,res){
  res.sendFile(__dirname + "/views/homepage.html");
})

app.listen(port, function(){
	console.log(__dirname);
	console.log('Paman Server Running on port 8080')
})
