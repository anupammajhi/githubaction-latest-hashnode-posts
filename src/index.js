const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https')

async function getInputs(){
    const publicationId = core.getInput('HASHNODE_PUBLICATION_ID')

    return {
        gqlEndpoint: core.getInput('HASHNODE_GQL_ENDPOINT'),
        PublicationId: publicationId,
        maxPosts: core.getInput('MAX_POSTS')
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

    var reqPromise = new Promise((resolve, reject) => {
        let req = https.request(gqlEndpoint, options, (res) => {
            let resdata = ''
            res.on('data', (d) => {
                resdata += d
            })
            res.on('end', () => {
                console.log(JSON.parse(resdata))
                const { data: { publication } } = JSON.parse(resdata)
    
                if(!publication){
                    core.setFailed(`Could not find publication...`)
                }
                else{
                    resolve(publication.posts.edges.map((edge) => edge.node))
                }
            })
    
            if (res.statusCode !== 200){
                core.setFailed(`Failed to fetch posts. StatusCode: ${res.statusCode}`)
            }
    
            
        })
        req.on('error', (e) => {
            console.log(e)
            core.setFailed(e)
            reject(e)
        })
        req.write(gqlQuery);
        req.end();
    })

    let result = await reqPromise
    console.log(`return Result : ${result}`)
    return result
}

async function main(){
    let inputs = await getInputs()
    let posts = await getPosts(inputs)
    core.setOutput('result', JSON.stringify(posts))
}

main()