
## Starting the databse

The following command will build and run image `sqlserver` in an interactive environment.
Use the `--rm` argument to remove the container as well as all the data associated (will remove any volumes set in Dockerfile)
```
docker build -t sqlserver -f sqlServer/Dockerfile --build-arg POSTGRES_USER=postgres --build-arg POSTGRES_PASSWORD=example --build-arg POSTGRES_VERSION=14.4 --build-arg POSTGRES_PORT=5432 --build-arg POSTGRES_FULL_VERSION=14.4 --build-arg POSTGRES_MAJOR_VERSION=14  sqlServer
docker run --rm -it -p 5432:5432 --name postgreserver sqlserver
```

Refer to the following to [use volume from previous container](https://github.com/moby/moby/issues/30647#issuecomment-277048695)

### Using postgresql container database

```
list databases: \l
connect to database: \c auth_svc
list tables: \dt
list table data: SELECT * FROM users;
```