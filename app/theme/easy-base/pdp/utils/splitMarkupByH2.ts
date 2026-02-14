export function splitMarkupByH2(markup: string) {
  const parts = markup.split(/<h2>/i).slice(1);

  return parts.map((part) => {
    const [title, ...rest] = part.split(/<\/h2>/i);
    return {
      title: title.trim(),
      content: rest.join("</h2>").trim(),
    };
  });
}
