# analytics-platform-control-panel-frontend
Control Panel webapp


## Getting Started

Install dependencies
```sh
npm install
```

**Environment variables**

You can set these directly with `export
API_USER=<username>` or add them to a `.env` file, which will be automatically
used to setup the environment when the Control Panel starts.

*Required*
```sh
API_USER=<username>
API_PASSWORD=<password>
```

*Optional*
```sh
API_URL="http://localhost:8000"  # Base URL of the control panel API
ENV=""  # Environment
EXPRESS_HOST=127.0.0.1  # Express bind host
EXPRESS_PORT=3000  # Express bind port
LOG_LEVEL="debug"
NODE_RESTART=1  # restart the app when file changes are detected
```

To run the webapp, enter the following:
```sh
npm start
```

Then you can browse to http://localhost:3000/ in your browser

To run tests, enter
```sh
npm test
```
