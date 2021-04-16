#!/usr/bin/env bash
set -eu
mongo -- "$MONGO_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);

    var user = '$MONGO_USERNAME';
    var passwd = '${MONGO_PASSWORD-}' || user;
    db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});
EOF
