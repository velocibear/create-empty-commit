import * as github from '@actions/github'
import {info, setFailed} from '@actions/core'

async function run(): Promise<void> {
  try {
    // const token = getInput('token')
    // const message = getInput('message')
    // const email = getInput('email')
    // const name = getInput('name')
    // const octokit = github.getOctokit(token)

    const payload = github.context.payload

    // const commit_sha = (event?.pull_request?.head?.sha ||
    //   process.env.GITHUB_SHA) as string
    // const ref = `heads/${event?.pull_request?.head?.ref as string}`
    // const full_repository = process.env.GITHUB_REPOSITORY as string
    // const [owner, repo] = full_repository.split('/')

    info(`payload ${payload}`)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
