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

## References

- https://www.bezkoder.com/react-typescript-login-example/
- https://www.npmjs.com/package/bootstrap/v/4.6.0
- https://formik.org/docs/guides/validation
- https://github.com/jquense/yup
- https://medium.com/@apzuk3/input-validation-in-golang-bc24cdec1835
- https://www.digitalocean.com/community/tutorials/react-manage-user-login-react-context
- https://levelup.gitconnected.com/microservices-with-go-grpc-api-gateway-and-authentication-part-1-2-393ad9fc9d30
- https://getbootstrap.com/
- https://react-bootstrap.github.io/getting-started/introduction
- https://stackoverflow.com/questions/49967779/axios-handling-errors