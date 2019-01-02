const bodyAnswer = (req, res) => {
  res.json({
    message: `Hello${req.body.name ? ' ' +req.body.name : ''}!`,
    version: req.version,
    method: req.method
  });
}

module.exports = {
  get: (req, res) => {
    res.json({
      message: `Hello${req.query.name ? ' ' + req.query.name : ''}!`,
      version: req.version,
      method: req.method
    });
  },
  post: bodyAnswer,
  put: bodyAnswer,
}