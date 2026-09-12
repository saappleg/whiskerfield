import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const publisherId = process.env.VITE_ADSENSE_PUBLISHER_ID?.trim()
  || 'pub-2209406347192595';
const adsTxtPath = new URL('../dist/ads.txt', import.meta.url);
const distIndexPath = new URL('../dist/index.html', import.meta.url);
const notFoundPath = new URL('../dist/404.html', import.meta.url);
const routeDirectories = ['stories', 'care', 'products', 'news', 'privacy', 'members'];

// GitHub Pages serves 404.html for clean share/sitemap URLs. Copying the built
// shell keeps the existing hash router intact while allowing /stories?article=…
// to resolve to the same public Journal reader.
await copyFile(distIndexPath, notFoundPath);
const routeShell = (await readFile(distIndexPath, 'utf8')).replace(
  '<head>',
  '<head>\n    <!-- Route shells live in subdirectories; keep Vite assets rooted at the site origin. -->\n    <base href="/" />',
);
await Promise.all(routeDirectories.map(async (route) => {
  const routeDirectory = new URL(`../dist/${route}/`, import.meta.url);
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(new URL('index.html', routeDirectory), routeShell, 'utf8');
}));

if (publisherId && /^pub-\d{16}$/.test(publisherId)) {
  await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
  await writeFile(
    adsTxtPath,
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    'utf8',
  );
} else {
  await rm(adsTxtPath, { force: true });
}
