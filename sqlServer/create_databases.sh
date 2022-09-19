#!/bin/bash
# Has to be connected as the postgresql database root user to work

# initialise database cluster and start postgre server
/usr/pgsql-${POSTGRES_MAJOR_VERSION}/bin/initdb -D ${PGDATA}
/usr/pgsql-${POSTGRES_MAJOR_VERSION}/bin/pg_ctl -D /etc/postgresql/ start

# create database for privileged user and drop the one made during the installation
if [ "${POSTGRES_USER}" != 'postgres' ]; then
  createdb ${POSTGRES_USER}
fi

# Create databases authentication
createdb "auth_svc"