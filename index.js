const core = require('@actions/core');
const github = require('@actions/github');
const { writeFileSync } = require('fs');
const { monotonicFactory } = require('hmtid');

const hmtid = monotonicFactory(undefined, '-', true);

const issueNumber = core.getInput('issue_number');
const token = core.getInput('token');
const workingDir = core.getInput('dir');
const noteId = core.getInput('note_id');
const issueTitle = core.getInput('issue_title');
const issueBody = core.getInput('issue_body');
let geometryX = core.getInput('x');
let geometryY = core.getInput('y');
const octokit = github.getOctokit(token)
const context = github.context;

console.log('# issueNumber: ' + issueNumber);

const getRandomInt = (min, max) => {
  // Get int value between min <= x < max
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
};

try {
// Create a card
const baseId = hmtid(Date.now());
const date = new Date().toISOString().replace(/^(.+?)T(.+?)\..+?$/, '$1 $2');
const cardBody = `---
_id: card/c${baseId}
date:
  createdDate: '${date}'
  modifiedDate: '${date}'
type: text/markdown
user: local
version: '1.0'
---
# ${issueTitle}

${issueBody}`;

writeFileSync(`${workingDir}/card/c${baseId}.md`, cardBody);

geometryX += getRandomInt(30, 100);
geometryY += getRandomInt(30, 100);
const geometryZ = 0;
const cardSketch = `_id: note/${noteId}/c${baseId}
condition:
  locked: false
date:
  createdDate: '${date}'
  modifiedDate: '${date}'
geometry:
  height: 300
  width: 300
  x: ${geometryX}
  'y': ${geometryY}
  z: ${geometryZ}
style:
  backgroundColor: '#ffffff'
  opacity: 1
  uiColor: '#f5f5f5'
  zoom: 1
`;
writeFileSync(`${workingDir}/note/${noteId}/c${baseId}.yml`, cardSketch);

// Close the issue. Cannot delete it.
octokit.issues.update({ ...context.repo, issue_number: issueNumber, state: 'closed' })


} catch (error) {
  core.setFailed(error.message);
}
