const admin = require('firebase-admin');

exports.database = () => admin.database().ref('v0');
