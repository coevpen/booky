const express = require('express');
const path = require('path');
const db = require('./config/connection');
//const routes = require('./routes');
const {ApolloServer} = require('apollo-server-express');
const {typeDefs, resolvers} = require('./Schemas');
const {authMiddleware} = require('./utils/auth');


const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  await server.start();
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at localhost:${PORT}${server.graphqlPath}`);
};

startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV) {
  app.use(express.static(path.resolve(process.cwd(), '../client/build')));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(process.cwd(), '../client/build/index.html'));
  });
}

//app.use(routes);



db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
