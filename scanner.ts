import axios from 'axios';

const Owner = 'LeGalzor'
const RepoName = 'interview-practice'
const SecretString = 'COMPANY_SECRET_123';
const rootUrl = `https://api.github.com/repos/${Owner}/${RepoName}/contents/`
const arrayOfSecretsPaths = [];

async function getRepoContent(path: string): string[] {
    const pathToQuery = path
  ? path
  : rootUrl;
    try {
        const response = await axios.get(pathToQuery, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
            });
        return response.data;
    }catch (e) {
        console.error("ERROR", e.message);
        throw e;
    }
}

async function handleFile(file, path: string) {
    const queriedFile = await getRepoContent(path);
    if (queriedFile.content && queriedFile.name.endsWith('txt')){
        const decodedText = Buffer.from(queriedFile.content, 'base64').toString('utf8');
        decodedText.includes(SecretString) ? arrayOfSecretsPaths.push(queriedFile.path) : null;
    }
}

async function traverseRepoContent(path?: string) {
    const repoRoot = await getRepoContent(path);
    for (const item of repoRoot) {
        const fullPath = `${rootUrl}${item.path}`;
        switch (item.type) {
            case 'file':
                await handleFile(item, fullPath);
                break;
            case 'dir':
                await traverseRepoContent(fullPath);
                continue;
        }
    }
    return arrayOfSecretsPaths;
}

(async function () {
  const responseArray = await traverseRepoContent();
  console.log(responseArray);
})();

