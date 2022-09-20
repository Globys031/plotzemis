## Getting started

Needs 3 terminals and docker desktop started.
```
cd Plotzemis
docker run --rm -it -p 5432:5432 --name postgreserver sqlserver
go run authServer/go/main.go

cd plotzemis
npm start
```

The entrypoint is index.tsx, but app.tsx is where almost all of the frontend logic resides.

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