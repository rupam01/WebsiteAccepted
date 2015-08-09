//var sys = require('sys');
var os = require('os');
// config/auth.js
var auth = {
    'googleAuth': {
        'clientID': '972304761099-o457it88g1c39mpue17rpgllcnv0vnla.apps.googleusercontent.com',
        'clientSecret': 'uJlVJnZjeX9xyOaJXvboanHI',
        'callbackURL': 'http://caltoc.scs.ryerson.ca:80/auth/google/callback'
    }
};
if (os.type() != 'Linux') {
    auth.googleAuth.callbackURL = 'http://localhost/auth/google/callback';
}
module.exports = auth;
//# sourceMappingURL=auth.js.map