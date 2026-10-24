import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { FileBlob, PresentationFile } = await import(pathToFileURL('C:/Users/cheni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs').href);
const { finalizePresentation } = await import(pathToFileURL('C:/Users/cheni/.codex/plugins/cache/openai-primary-runtime/presentations/26.1022.11436/skills/presentations/container_tools/artifact_tool_utils.mjs').href);
process.env.RUNTIME_NODE_MODULES = 'C:/Users/cheni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES = process.env.RUNTIME_NODE_MODULES;

const workspaceDir = 'C:/Users/cheni/Desktop/frontrain';
const input = path.join(workspaceDir, 'presentation_output', 'JohnnyStore_Business_Review_final.pptx');
const finalPath = path.join(workspaceDir, 'presentation_output', 'JohnnyStore_Business_Review_final_v2.pptx');
const buildDir = path.join(workspaceDir, 'presentation_build', 'styled');
const stagingDir = path.join(workspaceDir, '.codex-finalizer');
const renderDir = path.join(buildDir, 'rendered');
await fs.mkdir(renderDir, { recursive: true });
await fs.mkdir(stagingDir, { recursive: true });

const p = await PresentationFile.importPptx(await FileBlob.load(input));
const inspect = await p.inspect({ kind: 'textbox,shape,table,slide,notes', maxChars: 200000 });
const elements = inspect.ndjson.split(/\r?\n/).filter(Boolean).map((line) => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean);

for (const slide of p.slides.items) {
  slide.background.fill = 'linear(135deg, #DCEBFF 0%, #EEF0FF 52%, #F5E9FF 100%)';
}

for (const el of elements.filter((x) => x.kind === 'textbox' && x.id)) {
  const obj = p.resolve(el.id);
  const style = obj.text?.style ?? {};
  obj.text.style = { ...style, typeface: 'Inter' };
}

for (const [i, slide] of p.slides.items.entries()) {
  const png = await p.export({ slide, format: 'png', scale: 1 });
  await fs.writeFile(path.join(renderDir, `slide-${String(i + 1).padStart(2, '0')}.png`), new Uint8Array(await png.arrayBuffer()));
}
const montage = await p.export({ format: 'webp', montage: true });
await fs.writeFile(path.join(renderDir, 'montage.webp'), new Uint8Array(await montage.arrayBuffer()));

const candidatePath = path.join(stagingDir, 'styled-candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidatePath);
const result = await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath,
  explicitTotalSlideCount: 11,
  requiredNativeTableOwnerSlides: [2, 9],
  pythonExecutable: 'C:/Users/cheni/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
  integrityValidatorPath: 'C:/Users/cheni/.codex/plugins/cache/openai-primary-runtime/presentations/26.1022.11436/skills/presentations/container_tools/inspect_presentation_package_integrity.py',
  layoutValidatorPath: 'C:/Users/cheni/.codex/plugins/cache/openai-primary-runtime/presentations/26.1022.11436/skills/presentations/container_tools/inspect_presentation_layout_geometry.py',
  layoutArgs: ['--expected-slide-size-emu', '12192000,6858000', '--validate-bullet-geometry', '--validate-heading-fit', '--require-native-table-slide', '2', '--require-native-table-slide', '9'],
  fontPolicy: { basis: 'design', families: ['Inter', 'Roboto', 'Roboto Medium'] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, 'JohnnyStore_Business_Review_final_v2.validation.json'),
});
console.log(JSON.stringify(result, null, 2));
