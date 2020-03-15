

const config = require('../config/Config');
const User = require("../models/User");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Sign in the app
exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Utilisateur ou mot de passe incorrect" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Utilisateur ou mot de passe incorrect"
        });
      }

      // Creating a jwt token with the user id and based on the secret defined in the config file
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      // Send back to the front some infos about the user and the token created
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    });
};
