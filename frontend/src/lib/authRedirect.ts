// Only return to routes within this app, never an external URL.
export function safeReturnPath(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || Array.from(value).some(character => character === '\\' || character.charCodeAt(0) <= 32)) return null
  return value
}
