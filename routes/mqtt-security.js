const models  		= require('../models');
const express 		= require('express');
const sequelize 	= require('sequelize');
const utils         = require('../services/utils');
const router  		= express.Router();
const Op 			= sequelize.Op;


async function consultCredentials(username, password){

    if(username == 'admin' && password == '94561wecwecuheiew64654h46ew'){
        return {
            username: username, password: password, canSub:  '*/*', canPub:  'null/*'
        }
    }

    var clientTopic = await models.ClientsTopics.findOne({
        where:{
            [Op.or]:[
                {mqttUserPub: username, mqttPwdPub: password},
                {mqttUserSub: username, mqttPwdSub: password},
            ]
        }
    })

    if(!clientTopic){
       return null;
    }

    const topic = clientTopic.dataValues.topicId + "/*";

    var response = {
        username: username, password: password, canSub:  topic
    }

    if(clientTopic.dataValues.mqttUserPub === username){
        response.caPpub = topic;
    }else{
        response.canPub = "null/*";
    }

    return response;
}

async function consultUsername(username){
    var clientTopic = await models.ClientsTopics.findOne({
        where:{
            [Op.or]:[
                {mqttUserPub: username},
                {mqttUserSub: username},
            ]
        }
    })

    if(!clientTopic){
       return null;
    }

    const topic = clientTopic.dataValues.topicId + "/*";

    var response = {
        username: username, password: clientTopic.dataValues.mqttPwdPub, canSub:  topic
    }

    if(clientTopic.dataValues.mqttUserPub === username){
        response.canPub = topic;
    }else{
        response.canPub = "null/*";
    }

    return response;
}

const sliceTopic = (topic) => {
    return topic.split('/')
}

async function canSub(username, topic){
    const u = await consultUsername(username);
    if (!u) {
        return false
    }
    
    return sliceTopic(u.canSub)[0] === sliceTopic(topic)[0] || liceTopic(u.canPub)[0] === sliceTopic(topic)[0]
}

async function canPub(username, topic){
    const u = await consultUsername(username);
    if (!u) {
        return false
    }

    return sliceTopic(u.canPub)[0] === sliceTopic(topic)[0]
}

router

	/*
		Retorna usuario en formato:
        { username: 'test', password: 'test', canSub: 'test/*', canpub: 'test/*' },
	*/
	.post('/auth',async function(req,res,next){

        const username = req.body.username;
        const password = req.body.password;//!password || password.length < 3 ? null: utils.encriptarDato(password);
        
        if(!username || !password){
            return res.status(400).send({"error":"campos incompletos"})
        }
       
        const response = await consultCredentials(username, password);

        if(!response){
            return res.status(400).send({"error":"campos inválidos"})
        }
        
        return res.status(200).send(response)
    })

    /*
		Valida usuario admin
	*/
	.post('/admin_auth',async function(req,res,next){
        if (req.body.username === "admin") {
            res.status(200).send(req.body)
            return
        }
        res.status(400).send(req.body)
        return

    })

    /*
		Valida acl de la solicitud de usuario
	*/
    .post('/acl', (req, res) => {
        let authorized = false

        const { acc, clientid, username, topic } = req.body

        if(!acc || !username || !topic){
            return  res.status(400).send({"error":"campos incompletos"})
        }

        /*
        read       = 1
        write      = 2
        readWrite  = 3
        subscribe  = 4
        */
        switch (acc) {
            case 1:
                authorized = canSub(username, topic)
                break;
            case 2:
                authorized = canPub(username, topic)
                break;
            case 3:
                authorized = canSub(username, topic) && canPub(username, topic)
                break;
            case 4:
                authorized = canSub(username, topic)
                break;
            default:
                break;
        }

        // if authorized 
        // check authorized
        if (authorized) {
            res.status(200).send(req.body)
            return
        }
        res.status(400).send(req.body)
        return

    })
    	
module.exports = router;