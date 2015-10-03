/**
 * Created by natalie on 10/2/2015.
 */
var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    Members = require('./members');

router.get('/', function(req, res) {
    new Members(req.body);
    if (req.body) res.status(200).json({message: req.user});
});

router.route('/register')
    .get(function(req, res) {
        res.render('register', {});
    })
    .post(function(req, res) {
        new Members(req.body).save(function(err, result){
            if(err) res.status(500).json(err);
            else res.status(200).json(result);
        });
    })
    .patch(function (req,res) {
        req.params.id = {username:req.body.username};
        var setModifier = { $set: {}};
        setModifier.$set["bio"] = req.body.bio;
        setModifier.$set["interests"] = req.body.interests;
        Members.find(req.params.id, function (err, p) {
            if(!p){
                console.log('failed',p);
                return undefined;
            }
            else{
                Members.update({username: req.body.username},setModifier,function (err) {
                    if(err){
                        console.log('Error');
                    }
                    else{
                        console.log('Successful edit.');
                    }
                });
            }
        });
    });

router.route('/list')
    .get(function(req, res) {
        Members.find(req.query,function (err, result) {
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



