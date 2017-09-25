# analytics-platform-control-panel-frontend
Control Panel webapp


## Getting Started

Install dependencies
```sh
npm install
```

The Control Panel communicates with the API and requires username and password
environment variables to be set. You can set these directly with `export
API_USER=<username>` or add them to a `.env` file, which will be automatically
used to setup the environment when the Control Panel starts.
```sh
API_USER=<username>
API_PASSWORD=<password>
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
