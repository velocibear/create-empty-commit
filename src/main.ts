import * as github from '@actions/github'
import {getInput, info, setFailed} from '@actions/core'

export async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const message = getInput('message')
    const email = getInput('email')
    const name = getInput('name')
    const octokit = github.getOctokit(token)

    const payload = github.context.payload
    const repo = payload.repository?.full_name
    const owner = payload.repository?.owner?.name
    const pull_number = payload.issue?.id

    const commit_sha = payload.merge_commit_sha
    const ref = payload?.pull_request?.head.ref

    info(`issueId ${pull_number}`)
    info(`commit_sha ${commit_sha}`)
    info(`ref ${ref}`)

    if (!payload || !repo || !owner || !commit_sha || !ref || !pull_number)
      return

    // const commit_sha = (event?.pull_request?.head?.sha ||
    //   process.env.GITHUB_SHA) as string
    // const ref = `heads/${event?.pull_request?.head?.ref as string}`
    // const full_repository = process.env.GITHUB_REPOSITORY as string
    // const [owner, repo] = full_repository.split('/')

    const {
      data: {id}
    } = await octokit.rest.pulls.get({repo, owner, pull_number})

    info(`pullRequest ${id}`)

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
      author: {email, name}
    })

    await octokit.rest.git.updateRef({repo, owner, ref, sha: newSha})

    info(`payload ${payload.repository}`)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
