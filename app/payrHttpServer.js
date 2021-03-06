const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const pg = require('pg')

const port = 8080;

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var amount = 0;

app.use(urlencodedParser)
app.use(bodyParser.json())
app.use(express.static('resources'))

// set up error handler
app.use((err, request, response, next) => {  
	// log the error, for now just console.log
	console.log(err)
	response.status(500).send('Something broke!')
})

// handle get amount
app.get('/amount', (request, response) => {
	console.log("Amount requested. Returning %s.", amount);
	var ret = "amount = " + amount;
	response.send(ret);
})

// handle updating amount
app.post('/amount', urlencodedParser, (request, response) => {
	console.log(request.body)
	amount = request.body.amount;
	console.log(`Updated amount to be ${amount}`)
	response.end("" + amount)
})

app.listen(port, (err) => {
	if(err) {
		return console.log('something bad happened', err)
	}
	console.log(`server is listening on ${port}`)
})

function retrieveCurrentValueFromDB(){
	pg.connect(process.env.DATABASE_URL, function(err, client, done){
		if(err){
			console.log(err)
		}

		client.query("select amount from test.owes", [], function(err, result) {
			done()
			if(err){
				console.log(err)
			}
			console.log(result)
			var amount = result.rows[0].amount
			console.log('retrieved the following value from the db = %s', amount)
		})
	})
}
