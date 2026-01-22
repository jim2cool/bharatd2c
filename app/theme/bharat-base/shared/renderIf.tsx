export function renderIf(condition: any, node: JSX.Element) {
  if (!condition) return null;
  return node;
}
