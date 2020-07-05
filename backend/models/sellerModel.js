const mongoose = require('mongoose');
const crypto = require('crypto');
const {v1: uuidv1} = require('uuid');

const sellerSchema = new mongoose.Schema({
	name: {type:String, trim:true, required: true, unique: true, maxlength:32},
	email: {type:String, trim:true, required: true, unique: true, maxlength:32},
	hashed_password: {type:String, trim:true, required: true, maxlength:255},
	salt: {type:String}
}, {timestamps: true});


//virtual field
sellerSchema.virtual('password').set(function(password){
	this._password = password;
	this.salt = uuidv1();
	this.hashed_password = this.encryptedPassword(password);
}).get(function(){
	return this._password;
});

sellerSchema.methods = {
	authenticate: function(planText){
		return this.encryptedPassword(planText) === this.hashed_password;
	},

	encryptedPassword: function(password){
		if(!password) return '';
		try{
			return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
		}catch(err){
			return '';
		}
	}
}

module.exports = mongoose.model('Seller', sellerSchema);