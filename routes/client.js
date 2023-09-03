var models  		= require('../models');
var express 		= require('express');
const axios 		= require('axios');
var sequelize 	= require('sequelize');
var fs          = require('fs');
const mime      = require('mime');
var router      = express.Router();
var utils       = require('../services/utils');
const Op 			  = sequelize.Op;

const urlMqttService = "http://localhost:3337";

async function getDevice(deviceId){

  const url = urlMqttService + '/device/getOne/' + String(deviceId); 
  var device = await axios.get(url);
  return device.data;
}

async function updateDevice(device){

  const url = urlMqttService + '/device/update'; 
  if(device.name == null || device.name.length < 2){
    return {error: 'Name incomplete'};
  }

  var device = await axios.post(url, device);
  return device.data;
}

async function deleteDevice(device){

  const url = urlMqttService + '/device/delete'; 
  var device = await axios.post(url, device);
  return device.data;
}

async function createDevice(device){
	const url = urlMqttService + '/device/create'; 

	if(device.name == null || device.name.length < 2){
		return {error: 'Name incomplete'};
	}

  var device = await axios.post(url, device);
  return device.data;
}

async function createSignal(signal){
  const url = urlMqttService + '/signal/create'; 

  if(signal.name == null || signal.name.length < 2 || signal.signalType == null || signal.signalType.length < 2){
    return {error: 'Data incomplete'};
  }

  var signal = await axios.post(url, signal);
  return signal.data;
}

async function updateSignal(signal){

  const url = urlMqttService + '/signal/update'; 
  var signal = await axios.post(url, signal);
  return signal.data;
}

async function deleteSignal(signal){

  const url = urlMqttService + '/signal/delete'; 
  var signal = await axios.post(url, signal);
  return signal.data;
}

async function getAllDevicessPlusSignals(idsRoots){

  const url = urlMqttService + '/device/getAllDevicessPlusSignals'; 
  var device = await axios.post(url, {idsRoots:idsRoots});
  return device.data;
}

async function getAnalogHistorics(body){

  const url = urlMqttService + '/historics/getAnalog'; 
  var historics = await axios.post(url, body);
  return historics.data;
}

async function getAnalogHistoricsGroupedRanged(body){

  const url = urlMqttService + '/historics/getAnalogGroupedRanged'; 
  var historics = await axios.post(url, body);
  return historics.data;
}

async function getAvailableManual(ids){

  const url = urlMqttService + '/signal/getAvailableManual'; 
  return (await axios.post(url, {idsSignals:ids})).data;
}

router
//Get tree of all devices and signals of a client
.post('/getTree', async function(req,res){
  const companyId = req.body.companyId;

  console.log(companyId);

  try{
    const clientsTopics = await models.ClientsTopics.findAll({
      where:{
        companyId: companyId
      },
      order: [
          ['id', 'ASC']
      ],
    });

    var ids = [];

    for(var i=0; i< clientsTopics.length; i++){
      ids.push(clientsTopics[i].topicId);
    }


    var devices = await getAllDevicessPlusSignals(ids);

    res.send({success:devices});
  }
  catch(err){
    res.send({error:err});
  }
})

//Creates a device for a client
.post('/createDevice', async function(req,res){

  var companyId       = req.body.companyId;
  const deviceBody    = req.body;
  var device;
  var clientsTopics;

  try{
    if(deviceBody.deviceId){
      device = await getDevice(deviceBody.deviceId)
      if(device.success){
        companyId = null;
      }
    }

    device = await createDevice(deviceBody);

    if(device.error || !device.success)
      return res.send(device.error);

    if(companyId){
      clientsTopics = await models.ClientsTopics.create({
        companyId: companyId,
        topicId: device.success.uuid,
        mqttUserPub: device.success.uuid + "-pub",
        mqttPwdPub: req.body.password,
        mqttUserSub: device.success.uuid + "-sub",
        mqttPwdSub: req.body.password
      })
    }
    
    res.send({success:device});
  }
  catch(err){
      console.log({error: err});
      res.send({error:err});
  }
})

.post('/updateDevice', async function (req, res, next){

	var companyId     = req.body.companyId;
  const device      = req.body.device;

	try{

		var pDevice = await updateDevice(device);
    if(pDevice.error || !pDevice.success)
      return res.send(pDevice.error);

    const clientTopic = await models.ClientsTopics.findOne({
      where:{
        topicId: device.uuid
      }
    });

    if(!clientTopic){
      return res.send({error:"clientTopic not found"});
    }

    console.log(device.password)

    await clientTopic.update({
      mqttPwdPub: device.password,
      mqttPwdSub: device.password
    })

		res.send({success:pDevice});
	}
	catch(err){

		res.send({error:err});
	}
})

.post('/deleteDevice', async function (req, res, next){

	var companyId     = req.body.companyId;
  	const device      = req.body.device;

	try{

		var pDevice = await deleteDevice(device);
		res.send({success:pDevice});
	}
	catch(err){

		res.send({error:err});
	}
})

//Creates a signal for a client
.post('/createSignal', async function(req,res){

  var companyId       = req.body.companyId;
  const deviceId      = req.body.deviceId;
  var device;
  var clientsSignals;
  var signal;

  try{
    if(deviceId){
      device = await getDevice(deviceId)
      if(!device.success){
        return res.send({error: 'invalid deviceId'});
      }
    }

    signal = await createSignal(req.body);

    if(signal.error || !signal.success)
      return res.send(signal.error);

    if(companyId){
      clientsSignals = await models.ClientsSignals.create({
        companyId: companyId,
        signalId: signal.success.id
      })
    }
    
    res.send({success:signal});
  }
  catch(err){
      console.log({error: err});
      res.send({error:err});
  }
})

.post('/updateSignal', async function (req, res, next){

	var companyId     = req.body.companyId;
  	const signal      = req.body.signal;

	try{

		var pSignal = await updateSignal(signal);
		res.send({success:pSignal});
	}
	catch(err){

		res.send({error:err});
	}
})

.post('/deleteSignal', async function (req, res, next){

	var companyId     = req.body.companyId;
  	const signal      = req.body.signal;

	try{

		var pSignal = await deleteSignal(signal);
		res.send({success:pSignal});
	}
	catch(err){

		res.send({error:err});
	}
})


.post('/getAnalogHistorics', async function (req, res, next){

  try{

    var historics = await getAnalogHistorics(req.body);
    res.send(historics);
  }
  catch(err){

    console.log({error:err});
    res.send({error:err});
  }

})

.post('/getAnalogHistoricsGroupedRanged', async function (req, res, next){

  try{

    var historics = await getAnalogHistoricsGroupedRanged(req.body);
    res.send(historics);
  }
  catch(err){

    console.log({error:err});
    res.send({error:err});
  }

})

module.exports = router;