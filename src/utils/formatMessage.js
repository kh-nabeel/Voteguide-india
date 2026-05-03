/**
 * formatMessage.js
 * Utility to render Gemini AI response text safely inside React.
 *
 * Supported markdown tokens:
 *  - **bold text**  → <strong>bold text</strong>
 *  - Newlines (\n)  → <br />
 *
 * Security note: this output is only inserted via dangerouslySetInnerHTML
 * for *assistant* (bot) messages — never for user input, which is always
 * rendered as plain text children.
 *
 * @param   {string} text  Raw response string from the AI
 * @returns {string}       HTML-safe string with markdown converted
 */
export function formatMessage(text) {
  if (typeof text !== 'string') { return ''; }

  return text
    // Convert **bold** to <strong> — non-greedy to avoid spanning across lines
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert newlines to HTML line-breaks
    .replace(/\n/g, '<br />');
}
