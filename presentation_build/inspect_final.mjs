import { pathToFileURL } from 'node:url';
const { FileBlob, PresentationFile } = await import(pathToFileURL('C:/Users/cheni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs').href);
const p = await PresentationFile.importPptx(await FileBlob.load('C:/Users/cheni/Desktop/frontrain/presentation_output/JohnnyStore_Business_Review_v2.pptx'));
const info = await p.inspect({ kind:'slide,textbox,shape,notes', maxChars:200000 });
for (const line of info.ndjson.split(/\r?\n/)) { try { const x=JSON.parse(line); if (x.slideIndex===10) console.log(line); } catch {} }
