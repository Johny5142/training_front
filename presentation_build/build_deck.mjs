import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const artifact = await import(pathToFileURL('C:/Users/cheni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs').href);
const { FileBlob, PresentationFile } = artifact;
const { finalizePresentation } = await import(pathToFileURL('C:/Users/cheni/.codex/plugins/cache/openai-primary-runtime/presentations/26.1022.11436/skills/presentations/container_tools/artifact_tool_utils.mjs').href);

const workspaceDir = 'C:/Users/cheni/Desktop/frontrain';
const buildDir = path.join(workspaceDir, 'presentation_build');
const renderDir = path.join(buildDir, 'rendered');
const stagingDir = path.join(workspaceDir, '.codex-finalizer');
const finalDir = path.join(workspaceDir, 'presentation_output');
const finalPath = path.join(finalDir, 'JohnnyStore_Business_Review_v4.pptx');
const ref = 'C:/Users/cheni/.codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-business-review/assets/reference.pptx';
const skillDir = 'C:/Users/cheni/.codex/plugins/cache/openai-primary-runtime/presentations/26.1022.11436/skills/presentations';
const runtimePython = 'C:/Users/cheni/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES = 'C:/Users/cheni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES = process.env.RUNTIME_NODE_MODULES;

await fs.mkdir(renderDir, { recursive: true });
await fs.mkdir(stagingDir, { recursive: true });
await fs.mkdir(finalDir, { recursive: true });

const p = await PresentationFile.importPptx(await FileBlob.load(ref));
p.slides.keep([0,1,2,3,4,5,6,7,8,9,10]);

function allElements(inspectText, slideIndex) {
  return inspectText.split(/\r?\n/).filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter((x) => x && x.slideIndex === slideIndex && x.id);
}

async function inspectSlide(slideIndex) {
  const info = await p.inspect({ kind: 'slide,textbox,shape,table,chart,notes', maxChars: 200000 });
  return allElements(info.ndjson ?? '', slideIndex);
}

async function setTextBy(slideIndex, predicate, text) {
  const els = await inspectSlide(slideIndex);
  const hit = els.find(predicate);
  if (!hit) throw new Error(`Missing text target on slide ${slideIndex}: ${text}`);
  const obj = p.resolve(hit.id);
  obj.text = text;
  return obj;
}

async function setTexts(slideIndex, replacements) {
  const els = await inspectSlide(slideIndex);
  for (const [oldText, newText] of replacements) {
    const hit = els.find((x) => typeof x.text === 'string' && x.text.includes(oldText));
    if (!hit) throw new Error(`Missing replacement target on slide ${slideIndex}: ${oldText}`);
    p.resolve(hit.id).text = newText;
  }
}

async function notes(slideIndex, text) {
  const slide = p.slides.getItem(slideIndex);
  slide.speakerNotes.text = text;
}

await setTexts(0, [
  ['Enterprise Quarterly Business Review', 'JohnnyStore'],
  ['Q3 2026', 'ОКТЯБРЬ 2026'],
  ['Company or team name', 'FRONTRAIN / JOHNNYSTORE'],
]);
await setTextBy(0, (x) => x.kind === 'textbox' && x.position?.top > 500 && x.position?.width > 500, 'Обзор продукта, пользовательского пути и архитектуры учебного e-commerce проекта');
await notes(0, 'Начните с одной фразы: JohnnyStore — учебный одностраничный интернет-магазин техники, собранный как цельный продукт. Сегодня я покажу не только интерфейс, но и то, как устроен пользовательский сценарий и кодовая база.');

await setTexts(1, [
  ['Meeting title with agenda slide', 'JohnnyStore: обзор проекта'],
  ['Agenda', 'Содержание'],
]);
const agendaEls = await inspectSlide(1);
const agendaTable = p.resolve(agendaEls.find((x) => x.kind === 'table').id);
const agendaRows = [
  ['01', 'Идея продукта', 'JohnnyStore как учебный e-commerce flow'],
  ['02', 'Пользовательский путь', 'От каталога до подтверждения заказа'],
  ['03', 'Архитектура', 'React, Router, Context API и слой данных'],
  ['04', 'Текущий статус', '42 товара, 6 категорий, полный основной сценарий'],
  ['05', 'Следующие шаги', 'API, тесты и реальный backend'],
  ['06', 'Демо', 'Ключевые решения и ограничения проекта'],
];
agendaRows.forEach((row, r) => row.forEach((v, c) => agendaTable.cells.set(r, c, v)));
await notes(1, 'Здесь коротко обозначьте логику рассказа: сначала проблема и ценность, затем путь пользователя, потом техническая реализация и честный разговор о том, что уже готово и что логично делать дальше.');

await setTexts(2, [
  ['Executive Summary', 'Резюме проекта'],
  ['Quarter recap, verdict and asks', 'Проект собран как цельный shopping flow'],
  ['Quarter Status', 'Текущий статус'],
  ['Status copy here', 'Учебный MVP'],
  ['The Single Most Important Insight', 'Главный вывод'],
  ['The Leadership Decision Required', 'Решение на следующий этап'],
  ['Bottom line', 'Итог'],
]);
await setTextBy(2, (x) => x.kind === 'textbox' && x.position?.left < 600 && x.position?.top > 280 && x.position?.top < 450, 'JohnnyStore уже выглядит как продукт, а не набор отдельных экранов.');
await setTextBy(2, (x) => x.kind === 'textbox' && x.position?.left > 600 && x.position?.top > 280 && x.position?.top < 450, 'Сильная сторона проекта — связность: единое состояние каталога, корзины, избранного, сравнения и темы.');
await setTextBy(2, (x) => x.kind === 'textbox' && x.position?.left > 600 && x.position?.top > 500, 'Зафиксировать следующий шаг: подключить API и backend, сохранив текущий интерфейс и сервисный слой.');
await notes(2, 'Главная мысль слайда: проект уже демонстрирует связный пользовательский опыт. Важно подчеркнуть, что локальные данные — осознанное ограничение учебного MVP, а productService оставляет точку замены на API.');

await setTexts(3, [
  ['Intro and 2x2 card grid', 'Ключевая ценность для пользователя'],
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', 'Что получает пользователь'],
  ['Topic title goes here', 'Каталог'],
]);
const s3 = await inspectSlide(3);
await setTextBy(3, (x) => x.kind === 'textbox' && x.position?.top > 160 && x.position?.top < 240, 'Один интерфейс закрывает выбор, сравнение, сохранение и покупку техники.');
const cardTexts3 = [
  ['Каталог', '6 категорий техники и поиск без перезагрузки.'],
  ['Фильтры', 'Категория, цена, бренд, наличие и сортировка.'],
  ['Покупка', 'Корзина, валидация checkout и подтверждение заказа.'],
  ['Доступность', 'Адаптивность, keyboard focus и reduced motion.'],
];
const cardTargets3 = s3.filter((x) => x.kind === 'textbox' && x.position?.top > 280 && x.position?.top < 620 && x.position?.left < 1240);
const titleTargets3 = cardTargets3.filter((x) => x.text === 'Topic title goes here').sort((a,b) => a.position.top - b.position.top || a.position.left - b.position.left);
const bodyTargets3 = cardTargets3.filter((x) => x.text !== 'Topic title goes here' && x.position.height > 40).sort((a,b) => a.position.top - b.position.top || a.position.left - b.position.left);
titleTargets3.forEach((x, i) => p.resolve(x.id).text = cardTexts3[i + 1][0]);
bodyTargets3.forEach((x, i) => p.resolve(x.id).text = cardTexts3[i][1]);
await notes(3, 'Объясните ценность через четыре слоя: пользователь может найти товар, сузить выбор, принять решение и завершить покупку. Последняя карточка показывает, что проект учитывает не только визуальный слой, но и базовую доступность.');

await setTexts(4, [
  ['One column layout with three callout cards', 'Что уже реализовано'],
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultricies.', 'Функциональность собрана вокруг реального пути покупателя, а не вокруг отдельных компонентов.'],
  ['Topic title goes here', 'Каталог'],
]);
const s4 = await inspectSlide(4);
await setTextBy(4, (x) => x.kind === 'textbox' && x.position?.left < 600 && x.position?.top > 230 && x.position?.top < 650, 'Функциональность собрана вокруг реального пути покупателя, а не вокруг отдельных компонентов.');
const titles4 = ['Каталог', 'Checkout', 'Состояния интерфейса'];
const bodies4 = [
  'Поиск, фильтры, сортировка, категории и карточки товаров.',
  'Валидация формы, доставка, оплата и учебный номер заказа.',
  'Skeleton Loader, Error, Empty, 404, темы и mobile navigation.',
];
const titleEls4 = s4.filter((x) => x.text === 'Topic title goes here');
const bodyEls4 = s4.filter((x) => x.kind === 'textbox' && x.position?.left > 650 && x.position?.top > 170 && x.position?.top < 600 && x.position?.height > 40);
titleEls4.sort((a,b) => a.position.top - b.position.top).forEach((x, i) => p.resolve(x.id).text = titles4[i + 1]);
bodyEls4.forEach((x, i) => p.resolve(x.id).text = bodies4[i]);
await notes(4, 'На этом слайде перечислите то, что можно показать в демо без дополнительных пояснений: каталог, checkout и состояния интерфейса. Отдельно скажите, что оплата учебная и не подключена к реальному платёжному провайдеру.');

await setTexts(5, [
  ['Intro with three callout cards', 'Архитектура продукта'],
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', 'Структура проекта разделяет интерфейс, состояние и доступ к данным.'],
]);
const s5 = await inspectSlide(5);
await setTextBy(5, (x) => x.kind === 'textbox' && x.position?.top > 180 && x.position?.top < 330, 'Такой разрез упрощает развитие проекта и подключение backend без переписывания страниц.');
const card5Content = [
  'React + Router\nСтраницы и маршрутизация собраны вокруг единого Layout.',
  'Context API + useReducer\nКорзина, каталог, избранное, сравнение и тема живут отдельно.',
  'productService\nЛокальный JSON изолирован от компонентов и готов к замене на API.',
];
const cardBoxes5 = s5.filter((x) => x.kind === 'textbox' && x.position?.top > 380 && x.position?.top < 600 && x.position?.width < 400).sort((a,b) => a.position.left - b.position.left);
cardBoxes5.forEach((x, i) => p.resolve(x.id).text = card5Content[i]);
await notes(5, 'Расскажите об архитектуре сверху вниз: App задаёт маршруты, Layout собирает общую оболочку, Context-модули владеют состоянием, а productService скрывает источник данных. Это показывает, что структура проекта поддерживает дальнейшее расширение.');

await setTexts(6, [
  ['Two column layout', 'Пользовательский путь и техническая реализация'],
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultricies.', 'Пользовательский путь'],
]);
const s6 = await inspectSlide(6);
await setTextBy(6, (x) => x.kind === 'textbox' && x.position?.left < 600 && x.position?.top > 120 && x.position?.top < 230, 'Главный flow: главная → каталог → товар → корзина → checkout → подтверждение.');
const left6 = s6.find((x) => x.kind === 'textbox' && x.position?.top > 200 && x.position?.left < 600);
const right6 = s6.find((x) => x.kind === 'textbox' && x.position?.top > 200 && x.position?.left > 600);
if (left6) p.resolve(left6.id).text = '1. Найти товар через категории, поиск и фильтры.\n2. Открыть карточку и добавить в корзину или сравнение.\n3. Проверить заказ и пройти валидацию checkout.\n4. Получить учебный номер заказа и очистить корзину.';
if (right6) p.resolve(right6.id).text = '• React + Vite + React Router\n• Context API и useReducer\n• Fetch API через productService\n• localStorage для cart, favorites и theme\n• CSS media queries для desktop, tablet и mobile';
await notes(6, 'Проведите аудиторию по flow слева направо. Затем покажите, что каждому шагу соответствует понятный технический слой: маршруты, контексты, сервис данных и persistence в localStorage.');

await setTexts(7, [
  ['Statement headline', 'Учебный проект собран как настоящий e-commerce experience'],
]);
await setTextBy(7, (x) => x.kind === 'textbox' && x.position?.top > 320 && x.position?.top < 560, 'В нём есть не только витрина, но и полный пользовательский сценарий: поиск, выбор, сравнение, покупка и подтверждение.');
await notes(7, 'Это смысловой акцент презентации. Скажите: ценность JohnnyStore не в количестве экранов, а в том, что эти экраны работают вместе и ведут пользователя к понятному результату.');

await setTexts(8, [
  ['Full width data table slide', 'Каталог и покрытие сценариев'],
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultricies.', 'Фактический scope проекта'],
]);
const s8 = await inspectSlide(8);
await setTextBy(8, (x) => x.kind === 'textbox' && x.position?.left < 450 && x.position?.top > 280, 'Каталог содержит 42 позиции в 6 категориях. Все товары приходят из локального JSON через productService.');
const table8 = p.resolve(s8.find((x) => x.kind === 'table').id);
const rows8 = [
  ['Категория', 'Товаров', 'Пример', 'Сценарии'],
  ['Смартфоны', '6', 'iPhone 17 Pro', 'поиск, фильтр, корзина'],
  ['Ноутбуки', '5', 'MacBook Air 13” M3', 'карточка, сравнение'],
  ['Планшеты', '5', 'iPad Air 11” M2', 'избранное, отзывы'],
  ['Наушники', '5', 'AirPods 5', 'фильтр, checkout'],
  ['Мониторы', '6', 'Studio Display 27”', 'категория, сравнение'],
  ['Аксессуары', '15', 'Apple Pencil Pro', 'категория, поиск'],
  ['Итого', '42', 'Apple catalog', 'основной flow'],
  ['Источник', 'JSON', 'src/data/products.json', 'productService'],
  ['Ограничение', '—', 'нет реальной оплаты', 'учебный MVP'],
];
rows8.forEach((row, r) => row.forEach((v, c) => table8.cells.set(r, c, v)));
table8.position = { left: 498.98, top: 162.66, width: 711.6, height: 430 };
await notes(8, 'Здесь опирайтесь на цифры из исходного каталога: 42 позиции, шесть категорий. Важно честно обозначить ограничение: данные локальные, а оплата учебная. Это не скрывает ценность прототипа, а задаёт понятный план развития.');
console.log('done slide 8');

await setTexts(9, [
  ['Chart with three cards', 'Каталог как база для развития'],
  ['Topic title goes here', 'Локальный scope'],
]);
const s9 = await inspectSlide(9);
const bodies9 = s9.filter((x) => x.kind === 'textbox' && x.position?.left > 650 && x.position?.height > 40).sort((a,b) => a.position.top - b.position.top);
const titles9 = s9.filter((x) => x.kind === 'textbox' && x.position?.left > 650 && x.position?.top > 40 && x.position?.top < 620 && x.position?.height < 40).sort((a,b) => a.position.top - b.position.top);
['API-ready слой', 'Локальный scope', 'Ограничение'].forEach((value, i) => { if (titles9[i]) p.resolve(titles9[i].id).text = value; });
bodies9.forEach((x, i) => p.resolve(x.id).text = ['productService отделяет UI от источника данных.', '42 товара в 6 категориях.', 'Оплата учебная, backend пока не подключён.'][i]);
const chart9 = s9.find((x) => x.kind === 'chart');
if (chart9) p.delete(chart9.id);
const slide9 = p.slides.getItem(9);
const scopeBox = slide9.shapes.add({ geometry: 'textbox', position: { left: 42.91, top: 180, width: 537.97, height: 320 }, fill: 'none', line: { style: 'solid', fill: 'none', width: 0 } });
scopeBox.text = '42\nтовара\n\n6\nкатегорий';
scopeBox.text.style = { fontSize: 42, bold: true, color: '#3357B8', alignment: 'center' };
await notes(9, 'График показывает распределение каталога. Аксессуары дают самый широкий слой данных, а основные устройства распределены равномерно. Это хороший фундамент для будущего API, фильтров и аналитики ассортимента.');
console.log('done slide 9');

await setTexts(10, [
  ['Chart with three cards', 'Готовность к следующему этапу'],
  ['12%', '42'],
]);
const s10 = await inspectSlide(10);
const cardBodies10 = s10.filter((x) => x.kind === 'textbox' && x.position?.left > 650 && x.position?.top > 300 && x.position?.height > 40).sort((a,b) => a.position.left - b.position.left);
if (cardBodies10[0]) p.resolve(cardBodies10[0].id).text = '6 категорий техники';
if (cardBodies10[1]) p.resolve(cardBodies10[1].id).text = 'Следующий шаг: API + backend';
const chart10 = s10.find((x) => x.kind === 'chart');
if (chart10) p.delete(chart10.id);
const slide10 = p.slides.getItem(10);
const nextBox = slide10.shapes.add({ geometry: 'textbox', position: { left: 42.91, top: 180, width: 537.97, height: 320 }, fill: 'none', line: { style: 'solid', fill: 'none', width: 0 } });
nextBox.text = 'Следующий этап\n\nAPI + backend\nТесты\nРеальная оплата';
nextBox.text.style = { fontSize: 30, bold: true, color: '#3357B8', alignment: 'center' };
const els10 = await inspectSlide(10);
const largeNums10 = els10.filter((x) => x.kind === 'textbox' && x.position?.left > 650 && x.position?.top > 220 && x.position?.height > 70).sort((a,b) => a.position.left - b.position.left);
if (largeNums10[0]) p.resolve(largeNums10[0].id).text = '42';
if (largeNums10[1]) p.resolve(largeNums10[1].id).text = '6';
await setTextBy(10, (x) => x.kind === 'textbox' && x.position?.left > 650 && x.position?.left < 950 && x.position?.top > 230 && x.position?.top < 350, '42');
await setTextBy(10, (x) => x.kind === 'textbox' && x.position?.left > 950 && x.position?.top > 230 && x.position?.top < 350, '6');
await setTextBy(10, (x) => x.kind === 'textbox' && x.position?.left > 650 && x.position?.left < 950 && x.position?.top > 350 && x.position?.top < 470, 'товара в локальном каталоге');
await setTextBy(10, (x) => x.kind === 'textbox' && x.position?.left > 950 && x.position?.top > 350 && x.position?.top < 470, 'категорий техники');
await setTextBy(10, (x) => x.kind === 'textbox' && x.position?.left > 650 && x.position?.top > 500, 'Каталог изолирован от UI через productService');
await notes(10, 'Финал: сформулируйте три следующих действия. Первое — подключить API через уже выделенный productService. Второе — добавить тесты для основных reducer и checkout-сценариев. Третье — вынести заказ и оплату в backend.');
console.log('done slide 10');

for (const [i, slide] of p.slides.items.entries()) {
  const png = await p.export({ slide, format: 'png', scale: 1 });
  await fs.writeFile(path.join(renderDir, `slide-${String(i + 1).padStart(2, '0')}.png`), new Uint8Array(await png.arrayBuffer()));
}
const montage = await p.export({ format: 'webp', montage: true });
await fs.writeFile(path.join(renderDir, 'montage.webp'), new Uint8Array(await montage.arrayBuffer()));

const candidatePath = path.join(stagingDir, 'candidate.pptx');
const pptx = await PresentationFile.exportPptx(p);
await pptx.save(candidatePath);
const requirements = {
  workspaceDir,
  explicitTotalSlideCount: 11,
  requiredNativeTableOwnerSlides: [2,9],
};
const result = await finalizePresentation({
  ...requirements,
  candidatePath,
  finalPath,
  pythonExecutable: runtimePython,
  integrityValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs: ['--expected-slide-size-emu', '12192000,6858000', '--validate-bullet-geometry', '--validate-heading-fit', '--require-native-table-slide', '2', '--require-native-table-slide', '9'],
  fontPolicy: { basis: 'reference', families: ['Lora Medium', 'Lora SemiBold', 'Lora', 'Roboto', 'Roboto Medium', 'Roboto SemiBold', 'Helvetica Neue', 'Helvetica Neue Medium'], referencePath: ref, referenceSha256: '595b9a314c7e8e9b5f22180e7c7db167afba2437c8623d57e3f9dbc20af392c1' },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, 'JohnnyStore_Business_Review_v4.validation.json'),
});
console.log(JSON.stringify(result, null, 2));
