# Apollo API

## TODO

- Markdown Posts API

## Improvements to do

- Abstract auth check in resolvers (don't check for user in context every time)
- Abstract entities schema: ListResult, ListOptions, etc.
- key vs \_id ?
- setup tests
- unique config in repos (don't repeat label, etc.)
- Entities outside of repos
- Automated check for circular dependencies
- Entities soft deletion
- Separate not found vs not authorized
- Proper generics for abstract_graph_repo
- Proper error handling
- Abstract repo: have a more generic result: nb results, originNode/Destination, etc.
- when fetching related entities, group by relations: e.g.:
  - resource -> coveredConcepts : group by concept domain ?
  - user -> knownConcepts: group by domain ?


# Notes

- Set a property to null in Neo4j removes the property -> Later consumed as undefined. To unset a property through the API, send null