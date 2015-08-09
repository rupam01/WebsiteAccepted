import mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = new mongoose.Schema({

  local: {
    email: String,
    password: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
    datecreated: Date,
  }

});

// methods ======================
// generating a hash
userSchema.method('validPassword', function (password) {
  return bcrypt.compareSync(password, this.local.password);
});

userSchema.method('generateHash',
  password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null));

interface IUser extends mongoose.Document{
  local: {
    email: string,
    password: string,
  };
  google: {
    id: string,
    token: string,
    email: string,
    name: string,
    datecreated: Date,
  };
  generateHash(password: string) : string;
  validPassword(password: string): boolean;

}

// create the model for users and expose it to our app
var model = mongoose.model<IUser>('User', userSchema);
export = model;