// import express and apollo-server-express and the auth middleware and the typeDefs and resolvers
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');
const db = require('./config/connection');
// set up express app
const app = express();
const PORT = process.env.PORT || 3001;
// set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware({ req }),
});

// start the Apollo Server
async function startServer() {
  await server.start();

  // apply the Apollo Server instance as middleware to the Express app
  server.applyMiddleware({ app });

  // static assets for production
  if (process.env.NODE_ENV === 'production') {
    // using static assets from the client/dist folder
    app.use(express.static(path.resolve(__dirname, '../client/dist')));

    // serve the index.html file if we hit any route that is not the GraphQL endpoint
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
    });
  }

  // connect to MongoDB and start the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 Apollo Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();
