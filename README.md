# All stars football

Work in progress


## Background tasks

The "scripts" folder contains scripts that retrieve data from the [football API](https://www.api-football.com/) and persist it into a local database. For the moment we are retrieving some teams and the players of these teams.
We are limited by the number of requests per day. The script allows to start the process in incremental mode and to save the state when the number of requests is reached. We can then restart the script the next day and consider the new data.

### Running the script

In "scripts" folder, starts the mongo database:
```
yarn deps:up
```

Runs the script to populate the database:
```
yarn execute src/main.ts
```

### Lint & Test

To run lint and test you can respectively launch the command: yarn lint/yarn test --silent
