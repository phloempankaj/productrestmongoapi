var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var product = require('./product');

mongoose.connect('mongodb://localhost:27017/products', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch(error => console.log(error));

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8091;

var router = express.Router();

router.use(function (req, res, next) {
    // do logging 
    // do authentication 
    console.log('Logging of request will be done here');
    next(); // make sure we go to the next routes and don't stop here
});

app.use('/api', router);

router.route('/product').get((req, res) => {
    product.find((err, docs) => {
        if (err) {
            res.send(err);
        }
        console.log(docs);
        res.send(docs);
    });
});
router.route('/product/:id').get((req, res) => {
    product.findById(req.params.id, (err, doc) => {
        if (err) {
            res.send(err);
        }
        console.log(doc);
        res.send(doc);
    });
});
router.route('/product').post((req, res) => {
    var p = new product();
    p.title = req.body.title;
    p.price = req.body.price;
    p.instock = req.body.instock;
    p.photo = req.body.photo;
    p.save((err) => {
        if (err) {
            req.send(err);
        }
        res.send({
            message: 'Product Created.'
        });
    });

});
router.route('/product/:id').put((req, res) => {
    product.findById(req.params.id, (err, doc) => {
        if (err) {
            res.send(err);
        }
        console.log(doc);
        doc.title = req.body.title;
        doc.price = req.body.price;
        doc.instock = req.body.instock;
        doc.photo = req.body.photo;
        doc.save((err) => {
            if (err) {
                req.send(err);
            }
            res.send({
                message: 'Product Updated.'
            });
        });
    });
});
router.route('/product/:id').delete((req, res) => {
    product.remove({
        _id: req.params.id
    }, (err, doc) => {
        if (err) {
            res.send(err);
        }
        res.send({
            message: 'Product Removed'
        });
    });
});

app.listen(port);
console.log('Api Server is Started at http://localhost:' + port + "/api/");