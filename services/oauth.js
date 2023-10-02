var jwt = require('jwt-simple');
var moment = require('moment');

var TOKEN_SECRET = process.env.TOKEN_SECRET || "laviwweewvewvwedaesbella***123duhjnwblweb cjlwek.ncweljcble clplsplpaeqccecececececbakdbkadbciak akyigcugw80wgBCKJwbckjwbCKJWBCKJWvckvwCKVwkcvwkCWck";

exports.createToken = function(user) {
  var payload = {
    user: user,
    iat: moment().unix(),
    exp: moment().add(10, "days").unix()
  };
  return jwt.encode(payload, TOKEN_SECRET);
};

exports.veryfyUser = function(token) {
  try {
    var decoded = jwt.decode(token, TOKEN_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

exports.validateUser = function(token, userId){

  if(!token || !userId){
    return null;
  }
    
  var userToken = this.veryfyUser(token);
	if(userId == userToken.user.id){
		return userToken.user;
	}
	return null;
}
