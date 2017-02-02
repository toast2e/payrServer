var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();

const PORT = 8080;

dispatcher.setStatic('resources');

var amount = 0;

// handle get amount
dispatcher.onGet("/amount", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	console.log("Amount requested. Returning %s.", amount);
	var ret = "amount = " + amount;
	res.end(ret);
});

// handle updating the amount
dispatcher.onPost("/amount", function(req, res) {
	amount = req.body;
	console.log("Updated amount to %s", amount);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(amount);
});

function handleRequest(request, response){
	try{
		console.log(request.url);
		dispatcher.dispatch(request, response);
	} catch(err) {
		console.log(err);
	}
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
	console.log("Server listening on: http://localhost:%s", PORT);
});
