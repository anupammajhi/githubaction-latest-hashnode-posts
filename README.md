# Latest Hashnode Publication Posts

This GitHub Action retrieves posts from a Hashnode publication using GraphQL. The action accepts certain inputs and outputs the resulting posts in JSON format.

## Inputs

- `HASHNODE_PUBLICATION_ID` (required): The ID of the Hashnode publication.
- `HASHNODE_GQL_ENDPOINT` (optional): The GraphQL endpoint for Hashnode. (default is https://gql.hashnode.com)
- `MAX_POSTS` (optional): Maximum number of posts to retrieve (default is 10).

## Outputs

- `result`: JSON string containing the retrieved posts.

## Example Usage

```yaml
name: Get Hashnode Posts
on:
  push:
    branches:
      - main

jobs:
  get_posts:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Get Hashnode Posts
        id: hashnode-posts
        uses: anupammajhi/githubaction-latest-hashnode-posts@v1.0.0
        with:
          HASHNODE_PUBLICATION_ID: ${{ secrets.HASHNODE_PUBLICATION_ID }}
          HASHNODE_GQL_ENDPOINT: 'https://gql.hashnode.com' # Optional
          MAX_POSTS: 5  # Optional

      - name: Display Results
        run: echo "Hashnode Posts: ${{ steps.hashnode-posts.outputs.result }}"
