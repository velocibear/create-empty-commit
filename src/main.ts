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
    const repo = payload.repository?.name
    const owner = payload.issue?.user?.login
    const pull_number = payload.issue?.number

    if (!owner || !pull_number || !repo) return

    const {data} = await octokit.rest.pulls.get({repo, owner, pull_number})
    const ref = data?.head?.ref
    const commit_sha = data?.merge_commit_sha

    if (!commit_sha || !ref) return

    const {
      data: {tree}
    } = await octokit.rest.git.getCommit({repo, owner, commit_sha})

    info(`tree ${tree.sha}`)

    if (!tree) return

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

    info(`newSha ${newSha}`)
    info(`ref ${ref}`)

    await octokit.rest.git.updateRef({
      repo,
      owner,
      ref: `heads/${ref}`,
      sha: newSha
    })
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
