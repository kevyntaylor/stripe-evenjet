const stripe = require('stripe')('sk_test_51KAzwrH87ea0XXPddgmhGoFME05dZpZVaVIaBXnhxjDxzLmRUYykHvTUcb4acAIPVAo3KJ1W20JJZPylKktPb4F4007Xdwcozg');
var fs = require('fs');
var https = require('https');
const express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser')
const PORT = 8443;
const app = express();
app.use(express.static('.'));
// parse application/json
app.use(bodyParser.json())

app.use(cors())

https.createServer({
    key: fs.readFileSync('./privkey.pem','utf8'),
    cert: fs.readFileSync('./fullchain.pem','utf8')
}, app).listen(PORT, function(){
    console.log("My https server listening on port " + PORT + "...");
});


app.get('/', function(req, res){
    console.log('Se realizo peticion tipo GET');
});

app.post('/create-charge', async function (req, res){
  
   const customer = await stripe.customers.create({
	  description: 'Cliente Nuevo por Plataform Eventjet',
	  name: req.body.name,
	  email: req.body.email
	}).then(function (customer) {
		const charge =  stripe.charges.create({
		    amount: req.body.amount,
		    currency: 'usd',
		    source: req.body.token,
		    description: 'Pago Carrito de compras',
		    receipt_email: req.body.email,
		    customer: customer.id
		}).then(function (charge) {
			res.json({charge});
		})		
	});
});
