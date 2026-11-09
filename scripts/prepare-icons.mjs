import { readFile, writeFile } from 'node:fs/promises';
const css = await readFile('node_modules/boxicons/css/boxicons.min.css', 'utf8');
const names = ['right-top-arrow-circle','right-arrow-alt','menu','x','compass','code-alt','down-arrow-alt','devices','chip','trending-up','cloud','layer','plus','minus','palette','hotel','buildings','shopping-bag','briefcase-alt-2','rocket','dots-horizontal-rounded','check-circle','check','phone-call','user-voice','reset','user-check','transfer','user','bulb','info-circle','envelope','phone','download'];
let out = '/* Boxicons v2.1.4. Font: SIL OFL 1.1. See THIRD_PARTY_NOTICES.md. */\n@font-face{font-family:boxicons;font-weight:400;font-style:normal;font-display:block;src:url("../../node_modules/boxicons/fonts/boxicons.woff2") format("woff2")}\n.bx{font-family:boxicons!important;font-weight:400;font-style:normal;font-variant:normal;line-height:1;text-transform:none;speak:never;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}\n';
for(const name of names) { const match = css.match(new RegExp('\\.bx-' + name + ':before\\{[^}]+\\}')); if(!match) throw new Error('Missing icon: '+name); out += match[0]+'\n'; }
await writeFile('src/styles/icons.css',out);
console.log('Prepared the used Boxicons classes with a self-hosted WOFF2 font.');
