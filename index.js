const core = require('@actions/core');
const github = require('@actions/github');
const { writeFileSync } = require('fs');
const { monotonicFactory } = require('hmtid');

const hmtid = monotonicFactory(undefined, '-', true);

const workingDir = core.getInput('dir');
const noteId = core.getInput('note_id');
const issueTitle = core.getInput('issue_title');
const issueBody = core.getInput('issue_body');
let geometryX = parseInt(core.getInput('x'));
let geometryY = parseInt(core.getInput('y'));

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
  let cardBody = `---
_id: card/c${baseId}
date:
  createdDate: '${date}'
  modifiedDate: '${date}'
type: text/markdown
user: local
version: '1.0'
---
`;
  let title = issueTitle;
  let body = '';
  if (title.startsWith('[twitter]')) {
    title = title.replace(/^\[twitter\]/, '');
    body = `${issueBody}

&nbsp;

${title}`;
  }
  else {
    body = `${title}

${issueBody}`;
  }
  cardBody += body;

  writeFileSync(`${workingDir}/card/c${baseId}.md`, cardBody);

  geometryX += getRandomInt(30, 100);
  geometryY += getRandomInt(30, 100);
  const geometryZ = 0;
  const cardSketch = `_id: note/${noteId}/c${baseId}
condition: {}
date:
  createdDate: '${date}'
  modifiedDate: '${date}'
geometry:
  height: 300
  width: 300
  x: ${geometryX}
  'y': ${geometryY}
  z: ${geometryZ}
label:
  status: openedSticker
style:
  backgroundColor: '#ffffff'
  opacity: 1
  uiColor: '#f5f5f5'
  zoom: 1
`;
  writeFileSync(`${workingDir}/note/${noteId}/c${baseId}.yml`, cardSketch);

} catch (error) {
  core.setFailed(error.message);
}
