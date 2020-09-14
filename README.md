# Sci-Map.org api

Backend (GraphQl API) for [Sci-map.org](https://sci-map.org).

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

Please check out our [Contribution guide](https://sci-map.org/about/contributing).

## License

Licensed under [GNU GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/): You may copy, distribute and modify the software as long as you track changes/dates in source files. Any modifications to or software including (via compiler) GPL-licensed code must also be made available under the GPL along with build & install instructions.
