<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# nx-affected-apps-action
A Github Action to determine the affected apps within an Nx Monorepo.

> **NOTE:** this action won't work if your repo isn't an [Nx Workspace](https://nx.dev/web)

## Inputs

### `head`

SHA of the commit to compare **to** (defaults to `origin/master`)


### `base`

SHA of the commit to compare **from** (defaults to `origin/master~1`)


## Outputs

>Along with setting an output, this also sets an env variable in the workflow: `NX_AFFECTED_APPS`

### `affected_apps`

a JSON-encoded array of app names which are changed between the `base` and `head` commits


## Example

This action requires that your repo has been cloned by `actions/checkout`, and has node setup by `actions/setup-node`

```yml
jobs:
  find_nx_affected_apps:
    name: tsc
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: install node v11
      uses: actions/setup-node@v1
      with:
        node-version: 11
    - id: check_nx_apps
      uses: ignition-is-go/nx-affected-apps-action
	    with:
	  	head: 'origin/master'
	  	base: github.sha
  	- name: 'do something to only myApp'
	    if: contains(steps.check_nx_apps.affected_apps, 'myApp')
	    run: ...
```