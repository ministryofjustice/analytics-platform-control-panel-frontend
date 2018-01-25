# Analytical Platform Control Panel

## Running with Docker

### Environment variables
You need to set a few [environment variables](#env) which will be picked up by Docker. This can be done by creating a `.env` file with a variable set on each line with `VAR_NAME=value`.

### Build and run
Checkout the repo and run
```sh
docker-compose pull
docker-compose build
docker-compose up
```

### Create superuser (on first run)
In a separate terminal window, run
```sh
docker-compose exec api python3 manage.py createsuperuser
```

### View the app
Then browse to http://localhost:3000/
You can also access the API backend at http://localhost:8000/

### Developing
The docker container mounts the `app/` and `test/` directories from the host, and runs with `nodemon`, so file changes will be detected and the node app restarted. The `static/` directory is not monitored, so if you add files directly to this directory, you will need to rebuild the docker image to pick them up.

### Running the tests
```sh
docker-compose exec frontend yarn run test
```

## Running directly

### Install dependencies
```sh
yarn install
```

### <a name="env"></a>Environment variables
You should set these in a file named `.env` with each variable on a separate line, eg: `API_USER=username`

| name | value |
| ---- | ----- |
| `AUTH0_DOMAIN` | Domain of Auth0 tenant, eg: `dev-analytics-moj.eu.auth0.com` |
| `AUTH0_CLIENT_ID` | Client ID from Auth0 |
| `AUTH0_CLIENT_SECRET` | Client Secret from Auth0 |
| `OIDC_CLIENT_ID` | Same value as `AUTH0_CLIENT_ID` |
| `OIDC_CLIENT_SECRET` | Same value as `AUTH0_CLIENT_SECRET` |
| `IAM_ARN_BASE` | Used to construct ARNs |
| `K8S_WORKER_ROLE_NAME` | Used to construct ARN of IAM role |
| `SAML_PROVIDER` | Used to contruct ARN of SAML provider |
| `NODE_RESTART` | Set to `1` to enable restarting the app on file changes |
| `REDIS_HOST` | Hostname of your redis server |
| `REDIS_PASSWORD` | Set to any string (if not set, it will break) |
| `ENABLE_WRITE_TO_CLUSTER` | Set to `0` to prevent writing to Kubernetes or AWS (which will break if you have no AWS credentials) |
| `ENABLE_ACCESS_LOGS` | Set to `false` to disable HTTP request logging |

### Run a Redis server
```sh
redis-server --requirepass $REDIS_PASSWORD
```

### Run the webapp
```sh
yarn run start
```

### View the app
Browse to http://localhost:3000/

### Running the tests
```sh
yarn run test
```
