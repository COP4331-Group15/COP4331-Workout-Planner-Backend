const admin = require('firebase-admin');

const PRIVATE_KEY_ID = process.env.FIREBASE_PRIVATE_KEY_ID;
const PRIVATE_KEY = (process.env.NODE_ENV === "production" ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY) : process.env.FIREBASE_PRIVATE_KEY);
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const CLIENT_ID = process.env.FIREBASE_CLIENT_ID;
const AUTH_URI = process.env.FIREBASE_AUTH_URI;
const TOKEN_URI = process.env.FIREBASE_TOKEN_URI;
const AUTH_CERT = process.env.FIREBASE_AUTH_CERT;
const CLIENT_CERT = process.env.FIREBASE_CLIENT_CERT;

const SERVICE_ACCOUNT = {
    type: "service_account",
    project_id: "cop4331-group15",
    private_key_id: PRIVATE_KEY_ID,
    private_key: PRIVATE_KEY,
    client_email: CLIENT_EMAIL,
    client_id: CLIENT_ID,
    auth_uri: AUTH_URI,
    token_uri: TOKEN_URI,
    auth_provider_x509_cert_url: AUTH_CERT,
    client_x509_cert_url: CLIENT_CERT
}

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    databaseURL: 'https://cop4331-group15-default-rtdb.firebaseio.com'
});

async function decodeIDToken(req, res, next) {
    console.log("HEllo!");
    const header = req.headers?.authorization;
    if(header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];

        console.log("Has header! Parsing");

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req['currentUser'] = decodedToken;
            req['authToken'] = idToken;
            console.log("Has token");
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log(header);
    }

    next();
}

module.exports = decodeIDToken;