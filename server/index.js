require("dotenv").config();
import { GraphQLServer, PubSub } from "graphql-yoga";
import mongoose from "mongoose";

import schema from "../graphql/";
import { models } from "./config/db/";

import {ApolloServer} from 'apollo-server';

const { mongoURI: db } = process.env;

const pubsub = new PubSub();

const options = {
  port: process.env.PORT || 3000,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground"
};

const context = {
  models,
  pubsub
};

// Connect to MongoDB with Mongoose.
mongoose
  .connect(
    db,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
//
// const server = new GraphQLServer({
//   schema,
//   context
// });

    const server = new ApolloServer(
        {
            schema,
            context
            // context :async ({ req, connection }) => {
            //     if (connection) {
            //         // check connection for metadata
            //         return connection.context;
            //     } else {
            //         // check from req
            //         const token = req.headers.authorization || "";
            //
            //         return { token };
            //     }
            // },
            // subscriptions: {
            //     onConnect: (connectionParams, webSocket) => {
            //         if (connectionParams.authToken) {
            //             return validateToken(connectionParams.authToken)
            //                 .then(findUser(connectionParams.authToken))
            //                 .then(user => {
            //                     return {
            //                         currentUser: user,
            //                     };
            //                 });
            //         }
            //
            //         throw new Error('Missing auth token!');
            //     },
            // }
        },


    );

// server.start(options, ({ port }) => {
//   console.log(`🚀 Server is running on http://localhost:${port}`);
// });

// server.listen(options).then(({ url }) => {
//     console.log(`🚀  Server ready at ${url}`);
// });

server.listen(options).then(({ url,subscriptionsUrl }) => {
    console.log(`🚀  Server ready at ${url}`);
    console.log(`🚀  subscriptionURL ready at ${subscriptionsUrl}`);
});
