# Setup the database
CREATE DATABASE storefront_backend_dev;
CREATE DATABASE storefront_backend_test;

# save the enviromental variables
npm install dontenv and set enviromental variables over there

# setting up migrations
- ```npm install -g db-migrate```
- ```npm add db-migrate db-migrate-pg```
    ## create the database.json file
    ```{
            "dev": {
                "driver": "pg",
                "host": "127.0.0.1",
                "database": "fantasy_worlds",
                "user": "magical_user",
                "password": "password123"
            },
            "test": {
                "driver": "pg",
                "host": "127.0.0.1",
                "database": "fantasy_worlds_test",
                "user": "test_user",
                "password": "password123"
            }
            }
    ```

## CREATING MIGRATION FILES
- 