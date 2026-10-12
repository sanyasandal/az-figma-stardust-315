/*
 * Form block: Figma ".Forms" / "Login Window" (13496:9636, 13496:12041).
 * Each row is one item. First cell = type, second = label/text, third = placeholder or
 * options, any link in a field row = the "right side link" (e.g. Forgot your password?).
 * Types: title, text, email, tel, password, select, checkbox, toggle, submit, button,
 *        divider, note, image, empty, legend (group label), hint (footnote).
 * A label ending in "*" marks the field required.
 * Presentational only: submit validates in the browser and does not post anywhere.
 */

const FIELD_TYPES = ['text', 'email', 'tel', 'password', 'number', 'date'];
let fieldCount = 0;

function cellText(cell) {
  return cell ? cell.textContent.replace(/\s+/g, ' ').trim() : '';
}

function parseLabel(text) {
  const required = /\*\s*$/.test(text);
  return { text: text.replace(/\s*\*\s*$/, ''), required };
}

function labelEl(text, required, forId) {
  const label = document.createElement('label');
  label.className = 'form-label';
  if (forId) label.htmlFor = forId;
  label.textContent = text;
  if (required) {
    const star = document.createElement('span');
    star.className = 'form-required';
    star.setAttribute('aria-hidden', 'true');
    star.textContent = ' *';
    label.append(star);
  }
  return label;
}

function nameFor(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `field-${fieldCount}`;
}

function iconSpan(name) {
  const span = document.createElement('span');
  span.className = `icon icon-${name}`;
  const img = document.createElement('img');
  img.src = `${window.hlx?.codeBasePath || ''}/icons/${name}.svg`;
  img.alt = '';
  img.loading = 'lazy';
  span.append(img);
  return span;
}

function buildField(type, cells) {
  fieldCount += 1;
  const id = `form-field-${fieldCount}`;
  const { text, required } = parseLabel(cellText(cells[1]));
  const wrapper = document.createElement('div');
  wrapper.className = `form-field form-field-${type}`;

  const top = document.createElement('div');
  top.className = 'form-field-top';
  top.append(labelEl(text, required, id));
  const auxLink = cells.slice(2).map((c) => c?.querySelector('a')).find(Boolean);
  if (auxLink) {
    auxLink.className = 'form-aux-link';
    top.append(auxLink);
  }
  wrapper.append(top);

  const control = document.createElement('div');
  control.className = 'form-control';
  const placeholder = cells[2]?.querySelector('a') ? '' : cellText(cells[2]);

  if (type === 'select') {
    const select = document.createElement('select');
    select.id = id;
    select.name = nameFor(text);
    select.required = required;
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Select an option';
    empty.disabled = true;
    empty.selected = true;
    select.append(empty);
    const items = cells[2]?.querySelectorAll('li').length
      ? [...cells[2].querySelectorAll('li')].map(cellText)
      : placeholder.split(',').map((s) => s.trim());
    items.filter((s) => s && s !== 'Select an option').forEach((s) => {
      const opt = document.createElement('option');
      opt.textContent = s;
      select.append(opt);
    });
    control.append(select, iconSpan('chevron-down'));
  } else {
    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.name = nameFor(text);
    input.required = required;
    if (placeholder) input.placeholder = placeholder;
    const autocomplete = {
      email: 'email', password: 'current-password', tel: 'tel',
    }[type];
    if (autocomplete) input.autocomplete = autocomplete;
    control.append(input);
    if (type === 'password') {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'form-reveal';
      toggle.setAttribute('aria-label', 'Show password');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.append(iconSpan('eye'));
      toggle.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        toggle.setAttribute('aria-pressed', String(show));
        toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
      control.append(toggle);
    }
  }
  wrapper.append(control);
  return wrapper;
}

function buildCheck(type, cells) {
  fieldCount += 1;
  const id = `form-field-${fieldCount}`;
  const wrapper = document.createElement('div');
  wrapper.className = `form-check form-check-${type}`;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  const { text, required } = parseLabel(cellText(cells[1]));
  input.name = nameFor(text);
  input.required = required;
  if (type === 'toggle') input.setAttribute('role', 'switch');
  const label = document.createElement('label');
  label.htmlFor = id;
  // keep authored links and formatting inside the label
  if (cells[1]) {
    cells[1].querySelectorAll('p').forEach((p) => p.replaceWith(...p.childNodes));
    cells[1].querySelectorAll('a').forEach((a) => { a.className = ''; });
    label.append(...cells[1].childNodes);
  }
  if (required) {
    const last = label.lastChild;
    if (last?.nodeType === Node.TEXT_NODE) last.textContent = last.textContent.replace(/\s*\*\s*$/, '');
  }
  wrapper.append(input, label);
  return wrapper;
}

function buildButton(type, cells) {
  const link = cells[1]?.querySelector('a');
  if (type === 'submit' || !link) {
    const button = document.createElement('button');
    button.type = type === 'submit' ? 'submit' : 'button';
    button.className = `button ${type === 'submit' ? 'primary' : 'secondary'}`;
    button.textContent = cellText(cells[1]);
    return button;
  }
  link.className = 'button secondary';
  return link;
}

function groupLogin(form) {
  // fields above the divider (gap 24) are grouped apart from the alternatives below (gap 16)
  const divider = form.querySelector('.form-divider');
  if (!divider) return;
  const before = document.createElement('div');
  before.className = 'form-group';
  const after = document.createElement('div');
  after.className = 'form-group form-group-alt';
  let passed = false;
  [...form.children].forEach((el) => {
    if (el === divider) {
      passed = true;
      return;
    }
    if (el.classList.contains('form-title')) return;
    (passed ? after : before).append(el);
  });
  divider.before(before);
  divider.after(after);
}

export default function decorate(block) {
  const form = document.createElement('form');
  const isLogin = block.classList.contains('login');
  let background;
  let actions;
  const notes = [];

  const append = (el, kind) => {
    if (kind === 'action') {
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'form-actions';
        form.append(actions);
      }
      actions.append(el);
      return;
    }
    actions = null;
    form.append(el);
  };

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const type = cellText(cells[0]).toLowerCase();
    if (!type) return;
    if (type === 'image') {
      background = cells[1]?.querySelector('picture') || cells[1]?.querySelector('img');
    } else if (type === 'title') {
      const authored = cells[1]?.querySelector('h1, h2, h3, h4, h5, h6');
      const h = authored || document.createElement('h2');
      if (!authored) h.textContent = cellText(cells[1]);
      h.classList.add('form-title');
      append(h);
    } else if (type === 'legend') {
      const { text, required } = parseLabel(cellText(cells[1]));
      const legend = labelEl(text, required);
      const p = document.createElement('p');
      p.className = 'form-legend';
      p.append(...legend.childNodes);
      append(p);
    } else if (type === 'hint') {
      const hint = document.createElement('p');
      hint.className = 'form-hint';
      const text = cellText(cells[1]);
      if (text.startsWith('*')) {
        const star = document.createElement('span');
        star.className = 'form-required';
        star.textContent = '*';
        hint.append(star, ` ${text.slice(1).trim()}`);
      } else hint.textContent = text;
      append(hint);
    } else if (FIELD_TYPES.includes(type) || type === 'select') {
      append(buildField(type, cells));
    } else if (type === 'checkbox' || type === 'toggle') {
      append(buildCheck(type, cells));
    } else if (type === 'submit' || type === 'button') {
      append(buildButton(type, cells), 'action');
    } else if (type === 'divider') {
      const divider = document.createElement('div');
      divider.className = 'form-divider';
      divider.setAttribute('role', 'separator');
      const span = document.createElement('span');
      span.textContent = cellText(cells[1]);
      divider.append(span);
      append(divider);
    } else if (type === 'empty') {
      const spacer = document.createElement('div');
      spacer.className = 'form-empty';
      spacer.setAttribute('aria-hidden', 'true');
      append(spacer);
    } else if (type === 'note' && cells[1]) {
      const note = document.createElement('p');
      note.className = 'form-note';
      cells[1].querySelectorAll('p').forEach((p) => p.replaceWith(...p.childNodes, ' '));
      cells[1].querySelectorAll('a').forEach((a) => { a.className = ''; });
      note.append(...cells[1].childNodes);
      notes.push(note);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    let status = form.querySelector('.form-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'form-status';
      status.setAttribute('role', 'status');
      form.append(status);
    }
    status.textContent = 'Thank you. This preview form is not connected to a service yet.';
  });

  block.textContent = '';
  if (!isLogin) {
    block.append(form, ...notes);
    return;
  }

  if (background) {
    const bg = document.createElement('div');
    bg.className = 'form-background';
    bg.append(background);
    block.append(bg);
  }
  const card = document.createElement('div');
  card.className = 'form-card';
  const body = document.createElement('div');
  body.className = 'form-card-body';
  groupLogin(form);
  body.append(form);
  card.append(body);
  notes.forEach((n) => {
    const strip = document.createElement('div');
    strip.className = 'form-card-footer';
    strip.append(n);
    card.append(strip);
  });
  block.append(card);
}
