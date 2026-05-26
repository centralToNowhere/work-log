import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type ColorTree = {
  [key: string]: string | ColorTree;
};

const dirname = path.dirname(fileURLToPath(import.meta.url));
const themesDir = path.join(dirname, '../src/theme');

const flattenObject = (obj: ColorTree, prefix = ''): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue;
    }

    const value = obj[key];
    const varName = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'string') {
      result[varName] = value;
      continue;
    }

    Object.assign(result, flattenObject(value, varName));
  }

  return result;
};

const generateForTheme = async (themeName: string) => {
  const modulePath = `../src/theme/${themeName}/colors.ts`;
  const colorsModule = await import(modulePath);
  const flat = flattenObject(colorsModule.colors, 'color');

  const cssContent = `:root {\n${Object.entries(flat)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n')}\n}\n`;

  const outFile = path.join(themesDir, themeName, 'colors-generated.css');
  fs.writeFileSync(outFile, cssContent);
  console.log(`Generated CSS variables for theme "${themeName}": ${outFile}`);
};

const main = async () => {
  const entries = fs.readdirSync(themesDir, { withFileTypes: true });
  const themes = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  if (themes.length === 0) {
    console.warn('No theme folders found in', themesDir);
    return;
  }

  for (const theme of themes) {
    await generateForTheme(theme);
  }
};

main().catch((error: unknown) => {
  console.error('Error generating colors:', error);
  process.exit(1);
});
