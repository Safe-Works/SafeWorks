import http from 'http';
import App from './src/App';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? 3001;
const hostname = process.env.HOSTNAME ?? 'http://localhost';

App.set("port", port);
const server = http.createServer(App);
server.listen(port, () => {
  console.log(`[server]: SafeWorks server is running at ${hostname}:${port}`);
});

module.exports = App;