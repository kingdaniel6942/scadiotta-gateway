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
		Iniciar sesion
		params: 
			- email
			- password
	*/
	.post('/login',async function(req,res,next){

		var username = req.body.username;
		var password = req.body.password;
		password = !password || password.length < 3 ? null: utils.encriptarDato(password);

		try{
			var pUser = await models.User.findOne({
				where:{
					[Op.or]:[
						{email: username},
						{document: username},
					],
					password: password
				},
				include:[
					{
						model:models.Company,
						as:'company'
					}
				]
			})

			if(!pUser)
				return res.send({error: 'Invalid credentials'})

			var token = await oauth.createToken({id: pUser.id, companyId: pUser.companyId});
			pUser.password = "";

			return res.send({success: {user: pUser, token: token}});

		}catch(error){

			console.log({error:error});
			res.send({error:error})
		}
	})

	/*
		Esta loggeado
		params: 
			- user
			- token
	*/
	.post('/isLogged', authenticateToken, async function(req,res,next){

		return res.send({success: req.body.user})
	})

	/*
		Traer usuario por identificacion
		params: 
			- identificacion 
	*/
	.post('/getUserByIdentification', authenticateToken,async function(req,res,next){
		try{
			var pUser = await models.User.findOne({
				where:{
					identificacion: req.body.identificacion
				},
				include:[
					{
						model: models.Rol,
						as: 'rol'
					},
					{
						model: models.Tienda,
						as: 'tienda'
					}
				]
			})

			res.send({success: pUser});
		}catch(error){
			console.log({error:error});
			res.send({error:error})
		}
	})

	/*
		Actualizar usuario
		params: 
			- UID Correo
	*/
	.post('/updateUser', authenticateToken,async function(req,res,next){
		var usuario = req.body.nuser;
		
		if(usuario.companyId !== req.body.user?.companyId){
			throw "Invalid company Id"
		}

		var password = usuario.password;
		usuario.password = !password || password.length < 3 ? null: utils.encriptarDato(password);	


		try{
			var pUser = await models.User.findOne({
				where:{
					id: usuario.id
				}
			})

			if(!pUser)
				return res.send({error: 'usuario no existente'})

			var uUser = await pUser.update(usuario,{omitNull:true});
			res.send({success: uUser});
		}catch(error){
			console.log({error:error.message});
			res.send({error:error.message})
		}
	})

	/*
		Crear usuario
		params: 

	*/
	.post('/createUser', authenticateToken,async function(req,res,next){

		var user = req.body;
		user.companyId = req.body.user?.companyId;
		user.id=null;
		user.user = null;
		
		var password = req.body.password;
		user.password = !password || password.length < 3 ? null: utils.encriptarDato(password);	

		try{
			var pUser = await models.User.findOne({
				where:{
					[Op.or]:[
						{email: req.body.email},
						{document: req.body.document}
					]
				}
			})

			if(pUser){
				return res.send({error: 'usuario existente'})
			}

			pUser =	await models.User.create(user)
			res.send({success: pUser});
		}catch(error){
			console.log({error:error.message});
			res.send({error:error.message})
		}
	})

	.get('/list', authenticateToken,async function(req, res, next){

		try{
			var pUsers = await models.User.findAll({
				where:{
					state: 'ENABLED',
					companyId:req.body.user?.companyId
				}
			})

			res.send({success: pUsers});
		}catch(error){
			console.log({error:error.message});
			res.send({error:error.message})
		}
	})



	
module.exports = router;