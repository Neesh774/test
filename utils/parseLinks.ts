export default function parseLinks(content: string) {
  // return html content with links parsed
  const regex = /(?<=\s|^)(https?:\/\/[^\s]+)/g;
  const matches = content.match(regex);
  if (matches) {
    matches.forEach((match) => {
      const link = match.replaceAll("/", "/<wbr>");
      content = content.replace(match, `<a href="${match}" target="_blank" rel="noopener noreferrer" class="underline text-blue-400 hover:text-blue-500 transition-all">${link}</a>`);
    });
  }
  return content;
}