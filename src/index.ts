import {ApplicationConfig, TodolistApplication} from './application';

const OASGraph = require('oasgraph');
const express  = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const {createGraphQLSchema} = require('openapi-to-graphql');
const fetch = require('node-fetch');

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new TodolistApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  const openApiSchema = 'http://localhost:3000/openapi.json';

  const oas = await fetch(openApiSchema)
    .then((res: any) => {
      console.log(`JSON schema loaded successfully from ${openApiSchema}`);
      return res.json();
    })
    .catch((err: any) => {
      console.error('ERROR: ', err);
      throw err;
    });

  try {
    const {schema} = await createGraphQLSchema( oas,
      app.restServer.getApiSpec(),
      {
        srict: false,
        viewer: true,
        addSubOperations: true,
        sendOAuthTokeninQuery: false
      },
    );

    const myexpress = express();

    myexpress.use('/graphql',graphqlHTTP({schema: schema, graphiql: true}));
    myexpress.listen(3001, ()=>{
      console.log('OASGraph ready at http://localhost:3001/graphql');
    })
  } catch (error) {
    console.log('Errors: ',error.message);
  }

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
