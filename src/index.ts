import Server from './Http/server';

export default Server()
  .then(server => server.start());

