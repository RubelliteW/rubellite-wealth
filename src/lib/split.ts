/**
 * Lightweight SplitText alternative (GSAP SplitText is a Club plugin).
 * Wraps words/chars in overflow-hidden mask spans so GSAP can animate
 * the inner spans with y 110% -> 0 for the signature masked reveal.
 *
 * Usage:
 *   const split = splitWords(el);        // or splitChars(el)
 *   gsap.from(split.targets, { yPercent: 110, ... });
 *   split.revert();                       // during teardown
 */

export interface SplitResult {
  /** Inner spans to animate */
  targets: HTMLElement[];
  /** Restore the element's original HTML */
  revert: () => void;
}

function makeMasked(text: string, targets: HTMLElement[]): HTMLElement {
  const mask = document.createElement('span');
  mask.className = 'sw-mask';
  const inner = document.createElement('span');
  inner.className = 'sw-inner';
  inner.textContent = text;
  mask.appendChild(inner);
  targets.push(inner);
  return mask;
}

function wrapNode(node: ChildNode, by: 'words' | 'chars', targets: HTMLElement[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? '';
    const frag = document.createDocumentFragment();
    for (const token of text.split(/(\s+)/)) {
      if (token === '') continue;
      if (/^\s+$/.test(token)) {
        frag.appendChild(document.createTextNode(' '));
        continue;
      }
      if (by === 'words') {
        frag.appendChild(makeMasked(token, targets));
      } else {
        // chars: keep words unbreakable — nowrap word wrapper of char masks
        const word = document.createElement('span');
        word.style.display = 'inline-block';
        word.style.whiteSpace = 'nowrap';
        for (const ch of Array.from(token)) {
          word.appendChild(makeMasked(ch, targets));
        }
        frag.appendChild(word);
      }
    }
    node.parentNode?.replaceChild(frag, node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Recurse so italic/gradient spans keep their styling
    Array.from(node.childNodes).forEach((child) => wrapNode(child, by, targets));
  }
}

function split(el: HTMLElement, by: 'words' | 'chars'): SplitResult {
  const original = el.innerHTML;
  const targets: HTMLElement[] = [];
  Array.from(el.childNodes).forEach((node) => wrapNode(node, by, targets));
  return {
    targets,
    revert: () => {
      el.innerHTML = original;
    },
  };
}

export function splitWords(el: HTMLElement): SplitResult {
  return split(el, 'words');
}

export function splitChars(el: HTMLElement): SplitResult {
  return split(el, 'chars');
}
