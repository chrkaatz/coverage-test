module.exports = (req,res,next) => {
  if (!req.hasOwnProperty('version')) {
    req.version = 'v1'
  }
  next();
};
