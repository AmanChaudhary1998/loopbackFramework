import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,

  UserServiceBindings
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DbDataSource} from './datasources';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class TodolistApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    options =  Object.assign({},{
      rest: {
        port:3000,
        openApiSpec: {
          servers: [{url: 'http://localhost:3000'}]
        },
      },
    }, options,
    );
    super(options);

    // Mount authentication system
    this.component(AuthenticationComponent);

    // Mount JWT component
    this.component(JWTAuthenticationComponent);

    // Bind datasource
    this.dataSource(DbDataSource,UserServiceBindings.DATASOURCE_NAME);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

// import {BootMixin} from '@loopback/boot';
// import {ApplicationConfig} from '@loopback/core';
// import {GraphQLBindings, GraphQLComponent} from '@loopback/graphql';
// import {RepositoryMixin} from '@loopback/repository';
// import {RestApplication} from '@loopback/rest';
// import path from 'path';

// export {ApplicationConfig};

// export class TodolistApplication extends BootMixin(
//   RepositoryMixin(RestApplication),
// ) {
//   constructor(options: ApplicationConfig = {}) {
//     super(options);

//     this.component(GraphQLComponent);
//     const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
//     this.expressMiddleware('middleware.express.GraphQL', server.expressApp);

//     // It's possible to register a graphql context resolver
//     this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to(context => {
//       return {...context};
//     });

//     // Set up default home page
//     this.static('/', path.join(__dirname, '../public'));

//     this.projectRoot = __dirname;
//     // Customize @loopback/boot Booter Conventions here
//     this.bootOptions = {
//       graphqlResolvers: {
//         // Customize ControllerBooter Conventions here
//         dirs: ['graphql-resolvers'],
//         extensions: ['.js'],
//         nested: true,
//       },
//     };
//   }
// }
