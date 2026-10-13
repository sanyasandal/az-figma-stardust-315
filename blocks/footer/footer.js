import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * Figma "Footer" (13496:9714): three columns, then social icons + job code.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-container';
  const sections = fragment ? [...fragment.children] : [];

  // the section carrying icon links is the bottom row; all others are columns
  const bottomIndex = sections.findLastIndex((s) => s.querySelector('.icon'));
  const main = document.createElement('div');
  main.className = 'footer-columns';
  sections.forEach((section, i) => {
    if (i === bottomIndex) return;
    section.classList.add('footer-column');
    main.append(section);
  });
  footer.append(main);

  if (bottomIndex >= 0) {
    const bottom = sections[bottomIndex];
    bottom.classList.add('footer-bottom');
    bottom.querySelectorAll('a').forEach((a) => {
      const icon = a.querySelector('.icon');
      if (!icon) return;
      a.className = 'footer-social';
      const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.slice(5);
      if (!a.getAttribute('aria-label') && name) a.setAttribute('aria-label', name);
    });
    footer.append(bottom);
  }

  footer.querySelectorAll('.button-wrapper, .button').forEach((el) => { el.className = ''; });
  block.append(footer);
}
