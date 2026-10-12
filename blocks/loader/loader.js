/**
 * Loader block: Figma "Waiting Confirmation" dots (13530:16259).
 * Optional first cell = accessible status text (defaults to "Loading").
 * @param {Element} block
 */
export default function decorate(block) {
  const label = block.textContent.replace(/\s+/g, ' ').trim() || 'Loading';
  block.textContent = '';
  block.setAttribute('role', 'status');
  const sr = document.createElement('span');
  sr.className = 'loader-label';
  sr.textContent = label;
  const dots = document.createElement('div');
  dots.className = 'loader-dots';
  dots.setAttribute('aria-hidden', 'true');
  dots.innerHTML = '<span></span><span></span>';
  block.append(dots, sr);
}
