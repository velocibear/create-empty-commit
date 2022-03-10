# Create Empty Commit Github Action

Use this action to create a empty commit with a message on a PR
## Examples

```yaml
on:
  pull_request:
jobs:
    uses: velocibear/create-empty-commit@1.0.0
    with:
        token: ${{ secrets.GITHUB_TOKEN }}
        email: YourEmail@Email.com
        name: YourName
        message: Whatever commit message you want to post
```