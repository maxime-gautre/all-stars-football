# All stars football

Work in progress

## Backend

### Web server

To start the web server:
```
cd backend/webapp
make run
```

Server is listening on port 8080.

#### Lint & Test

To run lint and test you can respectively launch the command:

```
cd backend/webapp
make lint/test
```

### Background tasks

The "jobs" folder contains scripts that retrieve data from the [football API](https://www.api-football.com/) and persist it into a local database. For the moment we are retrieving some teams and the players of these teams.
We are limited by the number of requests per day. The script allows to start the process in incremental mode and to save the state when the number of requests is reached. We can then restart the script the next day and consider the new data.

#### Running the script

```
cd backend/jobs
make run
```

#### Lint & Test

To run lint and test you can respectively launch the command: 

```
cd backend/jobs
make lint/test
```
