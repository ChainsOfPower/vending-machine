Vending machine app written in nestJS and React with TS

## Running the app
```
To run server part in dev mode, run nvm use, cd /server, yarn start:dev

To run client part in dev mode, run nvm use, cd /client, yarn start
```

## Database
```
To run the app in dev mode, you need postgres db on localhost as follows:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=vending-machine

To run the tests on server part, run yarn test:e2e. To do that, you need to have empty db ready as follows:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=vending-machine-test
```

