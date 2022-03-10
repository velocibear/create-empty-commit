import { getInput, setOutput, setFailed, info } from "@actions/core";

async function run(): Promise<void> {
  try {
	const token = core/getInput("token");
	const message = getInput("message");
	const email = getInput("email");
	const name = getInput("name");
	const octokit = github.getOctokit(token);
    
    	const eventPath = process.env.GITHUB_EVENT_PATH;
	if (!eventPath) {
		throw new Error("EventPath not reserved");
	}
	const event = require(eventPath);
    
    	const commit_sha = (event?.pull_request?.head?.sha || process.env.GITHUB_SHA) as string;
    	const ref = `heads/${event?.pull_request?.head?.ref as string}`;
   	const full_repository = process.env.GITHUB_REPOSITORY as string;
    	const [owner, repo] = full_repository.split("/");
    
    info(`ref ${ref}`);
    
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
