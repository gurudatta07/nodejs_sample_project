const Company = require('../models').Company
var express = require('express');
var routes = express.Router();

const  companyService = require('../services/company/companyService');

routes.get('/',function(req,res){
    res.send('Inside company controllers')
})

routes.get('/getAllCompany', function(req,res) {
    try {
        console.log('============== getAllCompany Called ============')
        //var regionListPromise = regionService.getAllRegionsOnBuId(buId);
        var companyListPromise = companyService.getAllCompany();
        companyListPromise.then(resList => {
            console.log( resList );
            // res.render('regionsList', {
            //     layout: 'brandHomeLayout',
            //     buId: buId,
            //     regionListObj: resList,
            //     regionListString: JSON.stringify(resList)
            // })
            res.send(JSON.stringify(resList))
        }).catch(err => {            
            console.log('=============== Error in Company (getAllCompany) =============');
            console.log(err)
        })   
    } catch(err) {
        console.log('=============== Error in Company (getAllCompany) =============');
        console.log(err)
    }
})
module.exports = routes;