import fs from 'fs-extra';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_CONTENT_DIR = path.join(process.cwd(), 'public', 'content');

const ASSET_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.html'];

async function copyAssets() {
  // Ensure public/content directory exists
  await fs.ensureDir(PUBLIC_CONTENT_DIR);

  // Clear existing content
  await fs.emptyDir(PUBLIC_CONTENT_DIR);

  console.log('Copying content assets to public/content...');

  // Recursively find and copy assets
  await copyAssetsRecursive(CONTENT_DIR, '');

  console.log('Done copying assets.');
}

async function copyAssetsRecursive(sourceDir: string, relativePath: string) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetRelativePath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      await copyAssetsRecursive(sourcePath, targetRelativePath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();

      // Copy only asset files (images and HTML)
      if (ASSET_EXTENSIONS.includes(ext)) {
        const targetPath = path.join(PUBLIC_CONTENT_DIR, targetRelativePath);
        await fs.ensureDir(path.dirname(targetPath));
        await fs.copy(sourcePath, targetPath);
        console.log(`  Copied: ${targetRelativePath}`);
      }
    }
  }
}

copyAssets().catch(console.error);
