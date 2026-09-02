import { existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const documents = [
  {
    source: 'install-manual/windows/index.html',
    output: 'output/pdf/cluster-sound-album-windows-install-guide.pdf',
  },
  {
    source: 'install-manual/macosx/index.html',
    output: 'output/pdf/cluster-sound-album-macos-install-guide.pdf',
  },
  {
    source: 'user-manual/index.html',
    output: 'output/pdf/cluster-sound-album-user-guide.pdf',
  },
];

function browserCandidates() {
  if (process.platform === 'darwin') {
    return [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ];
  }

  if (process.platform === 'win32') {
    const programFiles = [
      process.env.PROGRAMFILES,
      process.env['PROGRAMFILES(X86)'],
      process.env.LOCALAPPDATA,
    ].filter(Boolean);

    return programFiles.flatMap((base) => [
      join(base, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      join(base, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    ]);
  }

  return ['google-chrome', 'google-chrome-stable', 'microsoft-edge', 'chromium', 'chromium-browser'];
}

function findBrowser() {
  for (const candidate of browserCandidates()) {
    if (candidate.includes('/') || candidate.includes('\\')) {
      if (existsSync(candidate)) return candidate;
      continue;
    }

    try {
      execFileSync('which', [candidate], { stdio: 'ignore' });
      return candidate;
    } catch {
      // Try the next browser candidate.
    }
  }

  throw new Error('Chrome、Edge、Chromiumのいずれかをインストールしてください。');
}

const browser = findBrowser();

for (const document of documents) {
  const source = resolve(projectRoot, document.source);
  const output = resolve(projectRoot, document.output);

  if (!existsSync(source)) {
    throw new Error(`入力HTMLが見つかりません: ${document.source}`);
  }

  mkdirSync(dirname(output), { recursive: true });

  console.log(`Building ${document.output}`);
  execFileSync(
    browser,
    [
      '--headless',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${output}`,
      pathToFileURL(source).href,
    ],
    { stdio: 'inherit' },
  );
}

console.log(`Built ${documents.length} PDF file(s).`);
