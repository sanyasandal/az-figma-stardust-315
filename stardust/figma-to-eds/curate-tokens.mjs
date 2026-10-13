#!/usr/bin/env node
// figma-to-eds curate phase. Regenerates stardust/reskin/donor-tokens.json and the
// generated :root token block in styles/styles.css from the captured Figma variables
// (stardust/canon-source/foundation/_variables-raw.json = excatfigma get_variable_defs
// on node 13496:19403). Run from the repo root; never hand-edit the outputs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = '13496:19403';
const raw = JSON.parse(readFileSync('stardust/canon-source/foundation/_variables-raw.json', 'utf8'));

// Transform: Figma path -> custom property: lowercase, "/" and whitespace -> "-", rest dropped.
const toProp = (path) => `--${path.toLowerCase().replace(/[/\s]+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
const px = (v) => (String(v) === '0' ? '0' : `${v}px`);
const pick = (re) => Object.entries(raw).filter(([k]) => re.test(k));
const group = (re, fmt = (v) => v) => Object.fromEntries(
  pick(re).map(([k, v]) => [toProp(k), { value: fmt(v), figma: k, src: SRC }]),
);

const colors = group(/^(Background|Text|Button|Forms|Table|Icon|Popup|Inpage|Default)\//);
const radii = group(/^Border\/border-radius\//, px);
const borderWidths = group(/^Border\/border-width\//, px);
const spacing = { ...group(/^Spacing\//, px), ...group(/^Container\//, px) };

const lh = (l, s) => String(+(Number(l) / Number(s)).toFixed(4));
// Composite: Font(family: "X", style: Y, size: N, weight: W, lineHeight: L)
const parseFont = (s) => {
  const m = /family: "([^"]+)", style: ([^,]+), size: ([\d.]+), weight: (\d+), lineHeight: ([\d.]+)/.exec(s);
  if (!m) return null;
  const [, family, style, size, weight, l] = m;
  return {
    'font-family': family,
    'font-weight': weight,
    'font-style': /italic/i.test(style) ? 'italic' : 'normal',
    'font-size': `${size}px`,
    'line-height': lh(l, size),
    'letter-spacing': '0',
  };
};
const styleKey = (n) => n.toLowerCase().replace(/[/. ]+/g, '-');
const styles = {};
pick(/^(Headings|Body)\//).forEach(([k, v]) => {
  const props = parseFont(v);
  if (props) styles[styleKey(k)] = { figma: k, src: SRC, props: { all: props } };
});
// Font/Body/* are published as split numeric variables (regular weight), not composites.
['body', 'body-large', 'details'].forEach((n) => {
  const size = raw[`Font/Body/${n}/font-size`];
  styles[styleKey(`Font/Body/${n}`)] = {
    figma: `Font/Body/${n}`,
    src: SRC,
    props: {
      all: {
        'font-family': raw['Font-Family/Text'],
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': `${size}px`,
        'line-height': lh(raw[`Font/Body/${n}/line-height`], size),
        'letter-spacing': '0',
      },
    },
  };
});

const typeVars = {};
Object.entries(styles).forEach(([key, s]) => {
  const p = s.props.all;
  typeVars[`--type-${key}-size`] = p['font-size'];
  typeVars[`--type-${key}-line-height`] = p['line-height'];
  typeVars[`--type-${key}-weight`] = p['font-weight'];
});

const sheet = {
  provenance: {
    class: 'figma-mcp',
    server: 'excatfigma',
    file: 'rsZQmpVzuyn0KhCDA3WN60 (One AZ v3.2)',
    node: SRC,
    generatedBy: 'stardust/figma-to-eds/curate-tokens.mjs',
  },
  transform: 'Figma variable path -> CSS custom property: lowercase, "/" and whitespace -> "-", other punctuation dropped. Numeric spacing/radius/border-width values get "px". Type styles -> --type-<style>-size/-line-height/-weight.',
  normalizations: [
    { rule: 'lineHeight px -> unitless (lineHeight / fontSize, 4 dp)' },
    { rule: 'Lexia is licensed and not served; the CSS stack falls back to Georgia/serif. Probe family check is recorded as a known divergence.' },
  ],
  curations: [
    { decision: 'Scales/*, Brand palettes/*, Color/<hex>, Tokens/*, Fonts/*, spacing/<n> omitted from :root', evidence: 'primitive or duplicate layers; the semantic layer (Text/, Button/, Forms/, Background/, Spacing/) resolves to the same hex/px and is what frames bind' },
    { decision: 'Element ramp: h1 -> Headings/Lexia-46, h2 -> Headings/Lexia-36, h3 -> Headings/Lexia-26, p -> Font/Body/body', evidence: 'page titles (.Title text 12529:1207) render Lexia 46/50 on every desktop frame; login card title renders 36/40. The kit publishes no HTML mapping: authored, not mandated (mapping.md)' },
    { decision: 'Font/Headings/H1 (56/60) not mapped', evidence: 'no frame in board 13496:19403 uses 56px' },
  ],
  probeBreakpoints: { mobile: 375, tablet: 768, desktop: 1440 },
  tokens: {
    colors,
    radii,
    borderWidths,
    shadows: {},
    spacing,
    sizing: {},
    spaceSemantic: {},
    sizeSemantic: {},
    durations: {},
    easings: {},
    typography: {
      families: { primary: raw['Font-Family/Text'], display: raw['Font-Family/Lexia'] },
      familyEquivalences: [['Inter'], ['Lexia', 'Georgia']],
      htmlMapping: {
        h1: 'Headings/Lexia-46', h2: 'Headings/Lexia-36', h3: 'Headings/Lexia-26', p: 'Font/Body/body',
      },
      htmlMappingSrc: 'authored from 12529:1207 + login card title',
      styles,
    },
  },
};

mkdirSync('stardust/reskin', { recursive: true });
writeFileSync('stardust/reskin/donor-tokens.json', `${JSON.stringify(sheet, null, 1)}\n`);

const lines = [];
const emit = (title, obj) => {
  if (lines.length) lines.push('');
  lines.push(`  /* ${title} */`);
  Object.entries(obj).forEach(([p, e]) => lines.push(`  ${p}: ${typeof e === 'string' ? e : e.value};`));
};
emit('colors', colors);
emit('radii', radii);
emit('border widths', borderWidths);
emit('spacing', spacing);
emit('type styles', typeVars);
// values are emitted verbatim from Figma, so hex shortening is disabled for this block
const block = `/* >>> figma tokens: generated by stardust/figma-to-eds/curate-tokens.mjs, do not edit */\n/* stylelint-disable color-hex-length */\n:root {\n${lines.join('\n')}\n}\n\n/* stylelint-enable color-hex-length */\n\n/* <<< figma tokens */`;

const cssPath = 'styles/styles.css';
const css = readFileSync(cssPath, 'utf8');
const re = /\/\* >>> figma tokens[\s\S]*?<<< figma tokens \*\//;
const marker = '/* >>> figma tokens';
let out;
if (re.test(css)) out = css.replace(re, block);
else if (css.includes(marker)) throw new Error('unterminated token block');
else {
  const i = css.indexOf(':root {');
  out = `${css.slice(0, i)}${block}\n\n${css.slice(i)}`;
}
writeFileSync(cssPath, out);
console.log(`colors ${Object.keys(colors).length}, radii ${Object.keys(radii).length}, borders ${Object.keys(borderWidths).length}, spacing ${Object.keys(spacing).length}, type styles ${Object.keys(styles).length}`);
