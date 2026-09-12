import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';

const publisherId = process.env.VITE_ADSENSE_PUBLISHER_ID?.trim()
  || 'pub-2209406347192595';
const adsTxtPath = new URL('../dist/ads.txt', import.meta.url);
const distIndexPath = new URL('../dist/index.html', import.meta.url);
const notFoundPath = new URL('../dist/404.html', import.meta.url);

// GitHub Pages serves 404.html for clean share/sitemap URLs. Copying the built
// shell keeps the existing hash router intact while allowing /stories?article=…
// to resolve to the same public Journal reader.
await copyFile(distIndexPath, notFoundPath);

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
