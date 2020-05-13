export function numberTransition(node, { speed = 50 }) {
  const isTextNode = (
    node.childNodes.length === 1 &&
    node.childNodes[0].nodeType === Node.TEXT_NODE
  );

  if (!isTextNode) {
    throw new Error(`This transition only works on elements with a single text node child`);
  }

  const text = node.textContent.trim();
  const number = Number(text);

  if (isNaN(number)) {
    throw new Error('Only numbers allowed');
  }

  const duration = text.length * speed;

  return {
    duration,
    tick: t => {
      node.textContent = 'LOL';
    }
  };
}