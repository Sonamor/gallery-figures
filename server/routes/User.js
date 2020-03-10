const { authJwt } = require("../middlewares/Index");
const controller = require("../controllers/User");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/user/test/all", controller.allAccess);

  app.get("/user/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/user/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/user/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};