import { mkdir, rm, writeFile } from 'node:fs/promises';

const publisherId = process.env.VITE_ADSENSE_PUBLISHER_ID?.trim()
  || 'pub-2209406347192595';
const adsTxtPath = new URL('../dist/ads.txt', import.meta.url);

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
