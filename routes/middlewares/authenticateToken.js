const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
  var token = req.headers.authorization;
  if(token) {
    token = token.split(' ')[1];
  }
  // console.log(token);
  // token.split(' ');
  // console.log(token);
  // token = token[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token not provided.' });
  }

  console.log(process.env.JWT_KEY);
  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode;
    req.body.created_by = decode.userId;
    console.log(req.body);

    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
