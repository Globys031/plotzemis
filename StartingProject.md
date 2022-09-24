## Getting started

Needs 3 terminals and docker desktop started.

The command below is only needed the first time around to build the docker image:
```
docker build -t sqlserver -f sqlServer/Dockerfile --build-arg POSTGRES_USER=postgres --build-arg POSTGRES_PASSWORD=example --build-arg POSTGRES_PORT=5432 --build-arg POSTGRES_FULL_VERSION=14.4 --build-arg POSTGRES_MAJOR_VERSION=14  sqlServer
```

The rest are always necessary:
```
cd Plotzemis
docker run --rm -it -p 5432:5432 --name postgreserver sqlserver
go run ./go/

cd plotzemis
npm start
```

The entrypoint is index.tsx, but app.tsx is where almost all of the frontend logic resides.

`.env.development` used by react, and `dev.env` by backend. [Read more here](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-development-environment-variables-in-env)
