const jwt = require("jsonwebtoken");
const config = require('../config/Config');

// Check if the token provided in the header by the front is the same as the token saved in the back
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "Aucun token fourni" });
  }
console.log(process.env.SECRET);
console.log(config.secret);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Non autorisé" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;
