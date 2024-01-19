const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';
// export the auth middleware
module.exports = {
  authMiddleware: function ({ req }) {
    // allows token to be sent via headers
    let token = req.headers.authorization || '';

    if (!token) {
      return { user: null };
    }
// split token string and return actual token
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      return { user: data };
    } catch (err) {
      console.error('Invalid token', err);
      return { user: null };
    }
    return req;
  },
  // function for our authenticated routes
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};