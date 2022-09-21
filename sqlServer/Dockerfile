# escape=`
# On windows, \ is the directory path separator
# This helps avoid problems if the escape character is different

########################
# Simple example of how official postgres images are built:
# https://github.com/docker-library/postgres/blob/cb70a79c1a8248d7e0db89d79dfbd08dd481be7f/9.4/Dockerfile#L47
# https://github.com/docker-library/postgres/blob/cb70a79c1a8248d7e0db89d79dfbd08dd481be7f/9.4/docker-entrypoint.sh#L11
########################

FROM almalinux:8

# ARG is only available during the build of a Docker image (RUN etc), 
# not after the image is created and containers are started from it (ENTRYPOINT, CMD). 
# You can use ARG values to set ENV values to work around that.
###############################################################
# ARG and ENV values are not suitable to handle secrets without extra care. 
# They stick around in your final images (unless you squash or use careful multi-stage builds).
ARG POSTGRES_PORT
# for ENV:
ARG POSTGRES_MAJOR_VERSION
ARG POSTGRES_FULL_VERSION
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD

# Container environment variables
ENV POSTGRES_MAJOR_VERSION=${POSTGRES_MAJOR_VERSION}
ENV POSTGRES_FULL_VERSION=${POSTGRES_FULL_VERSION}
# Postgres user related env variables
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV PGDATA=/var/lib/postgresql/data

# Prepare directories and environment for starting postgre
RUN mkdir /etc/postgresql `
  && mkdir -p /var/lib/postgresql/data `
  && mkdir -p /var/log/postgresql/ `
  && useradd -d /var/lib/postgresql ${POSTGRES_USER} `
  && echo "PATH=$PATH:/usr/pgsql-${POSTGRES_MAJOR_VERSION}/bin/" >> /etc/profile.d/path.sh `
  && echo "POSTGRES_USER=${POSTGRES_USER} `
  POSTGRES_PASSWORD=${POSTGRES_PASSWORD} `
  PGDATA=${PGDATA} `
  POSTGRES_MAJOR_VERSION=${POSTGRES_MAJOR_VERSION}" >> /var/lib/postgresql/.bash_profile `
  && chown -R ${POSTGRES_USER}. "/var/lib/postgresql/data" `
  && chown ${POSTGRES_USER}. "/var/log/postgresql/" `
  && chmod 700 /var/lib/postgresql/data

COPY ./config/postgresql.conf /etc/postgresql/postgresql.conf
COPY ./config/pg_hba.conf /etc/postgresql/pg_hba.conf
COPY ./create_databases.sh /
RUN chown postgres. /create_databases.sh
RUN chown -R ${POSTGRES_USER}. "/etc/postgresql"

####
# Keep in mind that RUN commands don't persist processes. It persists only filesystem changes
####

# Install packages for debugging as well as a specific version of postgre
RUN dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
# RUN dnf install -y procps lsof iproute file`
#   https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
RUN dnf -y module disable postgresql
RUN dnf install -y postgresql${POSTGRES_MAJOR_VERSION}-server `
  https://download.postgresql.org/pub/repos/yum/14/redhat/rhel-8.6-x86_64/postgresql${POSTGRES_MAJOR_VERSION}-server-${POSTGRES_FULL_VERSION}-1PGDG.rhel8.x86_64.rpm `
  https://download.postgresql.org/pub/repos/yum/14/redhat/rhel-8.6-x86_64/postgresql${POSTGRES_MAJOR_VERSION}-contrib-${POSTGRES_FULL_VERSION}-1PGDG.rhel8.x86_64.rpm

RUN mkdir -p  /var/run/postgresql/ && chown ${POSTGRES_USER}. "/var/run/postgresql/"

# https://github.com/moby/moby/issues/30647#issuecomment-276882545
# Add volumes to allow backup of config, logs and databases
# the VOLUME directive in the Dockerfile only defines that a volume should 
# be created for a specific path in the image (/container when running).
# The name of the volume should never be dictated by an image, 
# because that's something that should be defined at runtime
VOLUME ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

ENTRYPOINT ["/bin/bash", "-c", "su -c /create_databases.sh ${POSTGRES_USER} && /bin/bash"]

# You can specify whether the port listens on TCP or UDP,
# the default is TCP if the protocol is not specified.
#########################################################
# The EXPOSE instruction does not actually publish the port. 
# It functions as a type of documentation between the person who 
# builds the image and the person who runs the container, 
# about which ports are intended to be published. To actually publish the port 
# when running the container, use the -p flag on docker run to publish and map one or more ports
EXPOSE ${POSTGRES_PORT}

# Uncomment to immediately shows log output when starting container
# Though beware of how you'll shutdown the container then as to not leave any dangling volumes
# ENTRYPOINT ["/bin/bash", "-c", "tail -f /var/log/postgresql/postgresql*"]