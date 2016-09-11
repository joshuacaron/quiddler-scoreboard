const baseTitle = 'Quiddler'

export default function setTitle(...params) {
  document.title = [...params, baseTitle].join(' | ')
}
