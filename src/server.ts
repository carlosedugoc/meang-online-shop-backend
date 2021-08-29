/* eslint-disable linebreak-style */
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { Db } from 'mongodb';
import { IContext } from './interfaces/context.interface';
import chalk from 'chalk';

// if (process.env.NODE_ENV !== 'production'){
//   const env = environment
// }

async function init() {
  const app = express();
  app.use(cors());
  app.use(compression());

  const database = new Database();

  const db: Db = await database.init();

  const context = async({req, connection}: IContext) =>{
    const token = req ? req.headers.authorization : connection.authorization
    return {db, token}
  }

  const server = new ApolloServer({
    schema,
    introspection: true,
    context,
  });
  await server.start();
  server.applyMiddleware({ app });

  app.get(
    '/',
    expressPlayground({
      endpoint: '/graphql',
    })
  );

  const httpServer = createServer(app);
  const PORT = process.env.PORT || 2002;
  httpServer.listen({ port: PORT }, () => {
    {
      console.log(chalk.blueBright('==================SERVER API GRAPHQL===================='));
      console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
      console.log(`MESSAGE: ${chalk.greenBright('API MEANG - Online Shop CONNECT!!')}`);
      console.log(`GraphQL Server => @: http://localhost:${PORT}/graphql `);
      console.log(`WS Connection => @: ws://localhost:${PORT}/graphql `);
    }
  });
}

init();
