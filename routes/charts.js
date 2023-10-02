var models  		= require('../models');
var express 		= require('express');
var sequelize 		= require('sequelize');
var utils           = require('../services/utils');
var oauth           = require('../services/oauth');

var router  		= express.Router();
const Op 			= sequelize.Op;

function authenticateToken(req, res, next) {

	var userId   		= req.headers['userid'];
	var token   		= req.headers['x-access-token'];

	var pUser = oauth.validateUser(token, userId);

	console.log(userId)
	console.log(token)
	console.log(pUser)

	if(!pUser || !pUser.id){
		return res
			.status(403)
			.send({user:"Unauthorized"});
	}

	req.body.user = pUser
	next()
}

router
	/*
		get Pages
	*/
	.get('/getPages/:companyId', authenticateToken, async function(req,res,next){

        var companyId  = req.params.companyId;

        try{

            if(companyId !== req.body.user?.companyId){
                throw "Invalid Company"
            }
    
            const pages = await models.ClientPage.findAll({
                where:{
                  companyId: companyId
                },
                include:[
                    {
                        model: models.ChartPage,
                        as: 'charts'
                    }
                ],
                order: [
                    //[models.ClientPage, 'id', 'asc'],
                    [{model: models.ChartPage, as: 'charts'}, "position", "asc"]
                ]
            });

            res.send({success:pages});
        }
        catch(err){
    
            console.log(err?.message);
            res.send({error:err});
        }
    })

    /*
		add Page
	*/
	.post('/addPage', authenticateToken, async function(req,res,next){

        try{
            const page = await models.ClientPage.create({
                name: req.body.name,
                companyId: req.body.companyId
            });

            res.send({success:page});
        }
        catch(err){
    
            res.send({error:err});
        }
    })

    /*
		update Page
	*/
	.put('/updatePage',async function(req,res,next){

        req.body.companyId = null;

        try{
            const pPage = await models.ClientPage.findOne({
                where:{
                    id: req.body.id
                }
            })

            if(pPage == null){
                throw "page not found!"
            }

            await pPage.update({
                name: req.body.name
            });

            res.send({success:pPage});
        }
        catch(err){
    
            res.send({error:err});
        }
    })

    /*
		delete Page
	*/
	.delete('/deletePage/:idPage', authenticateToken, async function(req,res,next){

        try{
            const pPage = await models.ClientPage.findOne({
                where:{
                    id: req.params.idPage
                }
            })

            if(pPage == null){
                throw "page not found!"
            }

            await pPage.destroy()

            res.send({success:pPage});
        }
        catch(err){
    
            res.send({error:err});
        }
    })

    /*
		add Chart
	*/
	.post('/addChart', authenticateToken, async function(req,res,next){

        try{
            const chart = await models.ChartPage.create({
                url: req.body.url,
                tittle: req.body.tittle,
                width: req.body.width,
                height: req.body.height,
                position: req.body.position,
                pageId: req.body.pageId
            });

            res.send({success:chart});
        }
        catch(err){
    
            res.send({error:err});
        }
    })

    /*
		update Chart
	*/
	.put('/updateChart',async function(req,res,next){

        try{
            const pChart = await models.ChartPage.findOne({
                where:{
                    id: req.body.id
                }
            })

            if(pChart == null){
                throw "chart not found!"
            }

            await pChart.update({
                url: req.body.url,
                tittle: req.body.tittle,
                width: req.body.width,
                height: req.body.height,
                position: req.body.position,
                pageId: req.body.pageId
            });

            res.send({success:pChart});
        }
        catch(err){
    
            res.send({error:err});
        }
    })

    /*
		delete Chart
	*/
	.delete('/deleteChart/:id',async function(req,res,next){

        try{
            const pChart = await models.ChartPage.findOne({
                where:{
                    id: req.params.id
                }
            })

            if(pChart == null){
                throw "chart not found!"
            }

            await pChart.destroy();
            res.send({success:"Chart removed!"});
        }
        catch(err){
    
            res.send({error:err});
        }
    })

    module.exports = router;