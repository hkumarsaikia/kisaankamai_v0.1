import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToDownload = [
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA81yhN8kZwyN12xpX33xYZXBmWuxed-UXG0n7RiYFoOlqv1mRRwVAx285aLCLX3N3cSIm5LMCCiqcKSqNLoQF7--P_OAeWtZr8eZvZ43Kc5zI5zUdrbLNr9imo2Xvqj-Ukw4krSHhhswqVdpYF8WhVrlhyNnjc_ci5ExGWpUsZpSIvH2ELHyct0MEheNMPOSLG2V7OFAGoc8Zrto1KMGqKSZyPwULb37MZqa-6g0YeW9mDnG4oWmmFqofB36K9IdTuO6j4TNxQR0rk', name: 'hero-bg.jpg' },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCSR_mIdFRBBqayVtMzneJWz8cb0PRaz_Ga118rj5xqrmb87SxIDa-IgavO-6I4EsBsvXEacxGvoml3tuDBuJG-tpRu-lZdnaatGc3_7iP4z81LUG8OKD6W4BQogkPnRHbJtG3hMYVkr1zaL5lM22h27-2UoQm4EMbVsbl5CkJ6m_KdEjVHZxu_FLHB5o261N1M3cLdVAopLbSaRU4hsRKFEh8ljPaqLrUWHcUUSBz2WzNHCW4HzlL6P5-6DIOpkJYsDuUaMRpkj8v', name: 'about-bg.jpg' },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn6T_DPL6yOOdwqFO-Gzf5LjYejgyt3exP6xGjXAs6p_6qpcUDga6nKsZQjQoUFw8YaZ4wtzdc-URa09mKqTJyzCBAa-ryzWS62fDGJs6FU4E7Ar8-wTcbHh2iAwnbh3pcbAL1zE5IhFXXgCWEpsTgbFNcBee9YVM1ZKOIQ7YNSd-JF16WxeSQGEgtxikFao5sLEGmqWN3ehLfuyOUZlOCk7leuSSGashhxRvP5v1W9ZpNLxQICR2-J3yhBK59t6H2eMvYcxkxB0o8', name: 'desktop-hero.jpg' }
];

const targetDir = path.join(__dirname, '..', 'public', 'stitch-assets');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

imagesToDownload.forEach(image => {
  const filePath = path.join(targetDir, image.name);
  const file = fs.createWriteStream(filePath);
  
  https.get(image.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${image.name}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${image.name}: ${err.message}`);
  });
});
