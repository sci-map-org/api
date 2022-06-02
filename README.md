# Mapedia.org api

Backend (GraphQl API) for [mapedia.org](https://mapedia.org).

## Tech stack and design

Node.js + Typescript, Neo4j, Apollo Server.
We are considering a switch towards neo4j-graphql-js as it would highly improve the queries performance, however it currently lacks some features.

## Setup

- Install (Neo4j Desktop)[https://neo4j.com/download/] and create a database with 3.5.17 Neo4j version.

- Create a `.env` file from `.env.example`, with the proper database secrets.

Finally, run:

```
    yarn
```

### Development

```
yarn dev
```

After modifying the graphql schema, run:

```
yarn codegn
```

### Build

```
yarn build && yarn start
```

## Contributing

Please check out our [Contribution guide](https://beta.mapedia.org/about/contributing).

## License

Licensed under [GNU GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/): You may copy, distribute and modify the software as long as you track changes/dates in source files. Any modifications to or software including (via compiler) GPL-licensed code must also be made available under the GPL along with build & install instructions.

## Possible Improvements / TODO / TBD

- remove filters in repo methods where not needed (e.g. for resources) ?
- Use neo4j-graphql-js ? Right now doesn't have the abilities necessary
- use class entities for nodes / relationships ? Need to keep the same flexibilities if needed though
- Have clearer conventions on the repositories / resolvers, split logic

### Importing a db dump locally

Since v4, auth is managed in the system database which comes along in a db dump. Using neo4j desktop, replace the content of the data folder by the content of the dump, then reset the password. You'll see a warning message:
`Authentication Disabled To reset the password you need to enable authentication first.`
The password will still be reset. After that, run the database, open the browser and connect to the db (`:server connect` with neo4j/the password you just set).

### Postgres setup

Extensions required:

- uuid-ossp

You need to create the database manually then run migrations
