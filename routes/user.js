var models  		= require('../models');
var express 		= require('express');
var sequelize 		= require('sequelize');
var utils           = require('../services/utils');
var oauth           = require('../services/oauth');

var router  		= express.Router();

const Op 			= sequelize.Op;

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
			pUser.clave = "";

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
	.post('/isLogged',async function(req,res,next){

		var pUser   		= req.body.user;
		var token   		= req.headers['x-access-token'];

		if(!pUser || !token || !oauth.validateUser(token, pUser)){
			return res
	        	.status(401)
	            .send({user:"Unauthorized"});
		}

		return res.send({success: pUser})
	})

	/*
		Traer usuario por identificacion
		params: 
			- identificacion 
	*/
	.post('/getUserByIdentification',async function(req,res,next){
		try{
			var pUser = await models.Usuario.findOne({
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
	.post('/updateUser',async function(req,res,next){
		var usuario = req.body.usuario;

		try{
			var pUser = await models.Usuario.findOne({
				where:{
					correo: req.body.usuario.correo
				}
			})

			if(!pUser)
				return res.send({error: 'usuario no existente'})

			var uUser = await pUser.update(usuario);

			console.log('usuariooo',uUser)

			res.send({success: uUser});
		}catch(error){
			console.log({error:error});
			res.send({error:error})
		}
	})


	
module.exports = router;