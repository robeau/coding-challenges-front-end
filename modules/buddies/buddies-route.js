/**
 * Created by natalie on 10/1/2015.
 */
var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    Buddies = require('./buddies');

router.get('/', function(req, res) {
    new Buddies(req.body);
    if (req.body) res.status(200).json({message: req.user});
});

router.route('/register')
    .get(function(req, res) {
    res.render('register', {});
    })
    .post(function(req, res) {
        new Buddies(req.body).save(function(err, result){
            if(err) res.status(500).json(err);
            else res.status(200).json(result);
        });
    });

router.route('/list')
    .get(function(req, res) {
        Buddies.find(req.query,function (err, result) {
            if(err) res.status(500).json(err);
            else res.status(200).json(result);
        });
    })
    .delete(function (req,res) {
        console.log('line 33 of bud-r', req.query);
        Buddies.remove(req.query, function (err, result) {
            if(err) res.status(500).json(err);
            else res.status(200).json(result);
        });
    });

module.exports = router;



