// build.mjs
import esbuild from 'esbuild';
import { copyFile, mkdir, writeFile } from 'fs/promises';
import { readFileSync } from 'fs';

const outDir = 'dist';

async function build() {
  try {
    await mkdir(outDir, { recursive: true });

    await esbuild.build({
      entryPoints: ['index.tsx'],
      bundle: true,
      outfile: `${outDir}/index.js`,
      format: 'esm',
      jsx: 'automatic',
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
      },
      external: [
        'react',
        'react-dom/*',
        '@google/genai',
        'marked',
        'jspdf',
        'html2canvas',
        'dompurify',
      ],
    });
    console.log('✅ JavaScript bundled successfully.');

    const htmlTemplate = readFileSync('index.html', 'utf-8');
    const finalHtml = htmlTemplate.replace(
      'src="./index.tsx"',
      'src="./index.js"'
    );
    await writeFile(`${outDir}/index.html`, finalHtml);
    console.log('✅ index.html prepared for production.');

    await copyFile('metadata.json', `${outDir}/metadata.json`).catch(() => {});
    console.log('✅ Metadata copied.');

    console.log('🚀 Build finished successfully!');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();