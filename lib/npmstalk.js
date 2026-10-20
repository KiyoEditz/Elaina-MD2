import axios from 'axios';

async function npmstalk(packageName) {
  let stalk = await axios.get("https://registry.npmjs.org/" + encodeURIComponent(packageName));
  let versions = stalk.data.versions;
  let allver = Object.keys(versions);
  let verLatest = allver[allver.length - 1];
  let verPublish = allver[0];
  let packageLatest = versions[verLatest] || {};
  return {
    name: packageName,
    versionLatest: verLatest,
    versionPublish: verPublish,
    versionUpdate: allver.length,
    latestdependecies: packageLatest.dependencies ? Object.keys(packageLatest.dependencies).length : 0,
    publishdependecies: versions[verPublish]?.dependencies ? Object.keys(versions[verPublish].dependencies).length : 0,
    publishTime: stalk.data.time?.created || '-',
    latestPublishTime: stalk.data.time?.[verLatest] || '-'
  };
}

export { npmstalk };
export default { npmstalk };
