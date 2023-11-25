const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https')
require('dotenv').config();

// try {
//     const nameToGreet = core.getInput('who-to-greet');
//     console.log(`Hello Hello Hello ${nameToGreet}`);
//     const time = (new Date()).toTimeString();
//     core.setOutput("time", time);
//     const payload = JSON.stringify(github.context.payload, undefined, 2)
//     console.log(`The event payload ${payload}`)
// }
// catch (e){
//     core.setFailed(e.message);
// }
const DEFAULT_GQL_ENDPOINT = "https://gql.hashnode.com"
const DEFAULT_MAX_POSTS = '10'


async function getInputs(){
    const publicationId = process.env.HASHNODE_PUBLICATION_ID

    return {
        gqlEndpoint: process.env.HASHNODE_GQL_ENDPOINT || DEFAULT_GQL_ENDPOINT,
        PublicationId: publicationId,
        maxPosts: process.env.MAX_POSTS || DEFAULT_MAX_POSTS
    }
}

async function getPosts(inputs) {
    const { gqlEndpoint, PublicationId, maxPosts } = inputs
    const gqlHeaders = {
        'Content-Type': 'application/json'
    }

    // const gqlQuery = JSON.stringify({})
    const gqlQuery = JSON.stringify(
        {
            query: `{
                    publication(id: "${PublicationId}") {
                        posts(first: ${maxPosts}) {
                        edges {
                            node {
                            id
                            title
                            subtitle
                            brief
                            publishedAt
                            tags {
                                name
                                slug
                            }
                            url
                            coverImage {
                                url
                            }
                            readTimeInMinutes
                            views 
                            series {
                                name
                            }
                            }
                        }
                        }
                    }
                  }`
        }
    )
    
    const options = {
        method: 'POST',
        headers: gqlHeaders
    }

    let req = https.request(gqlEndpoint, options, (res) => {
        let data = ''
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', (d) => {
            data += d
        })
        res.on('end', () => {
            console.log(JSON.parse(data))
        })
    })
    req.on('error', (e) => {
        console.log(e)
    })
    req.write(gqlQuery);
    req.end();

}

async function main(){
    let inputs = await getInputs()
    let posts = await getPosts(inputs)
}

main()