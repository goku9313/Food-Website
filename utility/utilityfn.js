// module.exports.checkId = function checkId(req, res, next, id) {
//   // console.log(id);
//   if (id < 0 || id > plans.length) {
//     return res.status(404).json({
//       status: "failed",
//       data: "Wrong Id"
//     });
//   }
//   next();
// };

// module.exports.checkbody = function checkbody(req, res, next) {
//   if (Object.keys(req.body).length == 0) {
//     return res.status(404).json({
//       status: "client error",
//       data: "data not sent"
//     });
//   }
//   next();
// };