import * as github from '@actions/github'
import {getInput, info, setFailed} from '@actions/core'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const message = getInput('message')
    const email = getInput('email')
    // const name = getInput('name')
    const octokit = github.getOctokit(token)

    const payload = github.context.payload
    const repo = payload.repository
    const owner = payload.repository?.owner
    const commit_sha = payload.merge_commit_sha
    const ref = payload?.pull_request?.head.ref

    info(`owner ${owner}`)
    info(`commit_sha ${commit_sha}`)
    info(`ref ${ref}`)

    // const commit_sha = (event?.pull_request?.head?.sha ||
    //   process.env.GITHUB_SHA) as string
    // const ref = `heads/${event?.pull_request?.head?.ref as string}`
    // const full_repository = process.env.GITHUB_REPOSITORY as string
    // const [owner, repo] = full_repository.split('/')

    const {
      data: {tree}
    } = await octokit.rest.git.getCommit({repo, owner, commit_sha})

    const {
      data: {sha: newSha}
    } = await octokit.rest.git.createCommit({
      repo,
      owner,
      parents: [commit_sha],
      tree: tree.sha,
      message,
      author: {email}
    })

    await octokit.rest.git.updateRef({repo, owner, ref, sha: newSha})

    info(`payload ${payload.repository}`)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
