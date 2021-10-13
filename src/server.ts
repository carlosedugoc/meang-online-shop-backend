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
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub()

async function init() {
  const app = express();
  const httpServer = createServer(app);
  const PORT = process.env.PORT || 2002;

  app.use(cors());
  app.use(compression());

  const database = new Database();

  const db: Db = await database.init();

  const context = async({req, connection}: IContext) =>{
    const token = req ? req.headers.authorization : connection.authorization
    return {db, token, pubsub}
  }

  const server = new ApolloServer({
    schema,
    introspection: true,
    context,
    
  });
  await server.start();
  server.applyMiddleware({ app });

  app.get('/', expressPlayground({ endpoint: `http://localhost:${PORT}/graphql` }));
 
  httpServer.listen(PORT, () => {
    new SubscriptionServer(
      { execute, 
        subscribe, schema, 
        async onConnect() {
            return context;
        },
      },
      { server: httpServer, path: server.graphqlPath }
    );
      console.log(chalk.blueBright('==================SERVER API GRAPHQL===================='));
      console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
      console.log(`MESSAGE: ${chalk.greenBright('API MEANG - Online Shop CONNECT!!')}`);
      console.log(`GraphQL Server => @: http://localhost:${PORT}/graphql `);
      console.log(`WS Connection => @: ws://localhost:${PORT}/graphql`);
  });
}

init();
