import { watch } from 'vue'

/**
 * Read filter state from the current URL hash query parameters.
 * Returns { category, tags, scenario, q }
 */
export function readFromURL() {
  const hash = window.location.hash // e.g. "#/?category=xxx&tags=a,b"
  const queryStart = hash.indexOf('?')
  if (queryStart === -1) return { category: null, tags: [], scenario: null, q: '' }

  const search = hash.slice(queryStart)
  const params = new URLSearchParams(search)

  return {
    category: params.get('category') ? decodeURIComponent(params.get('category')) : null,
    tags: params.get('tags') ? params.get('tags').split(',').map(t => decodeURIComponent(t.trim())) : [],
    scenario: params.get('scenario') ? decodeURIComponent(params.get('scenario')) : null,
    q: params.get('q') ? decodeURIComponent(params.get('q')) : '',
  }
}

/**
 * Write filter state to the URL hash query parameters.
 */
export function syncToURL({ category, tags, scenario, q }) {
  const params = new URLSearchParams()
  if (category && category !== '全部') params.set('category', encodeURIComponent(category))
  if (tags && tags.length > 0) params.set('tags', tags.map(t => encodeURIComponent(t)).join(','))
  if (scenario) params.set('scenario', encodeURIComponent(scenario))
  if (q && q.trim()) params.set('q', encodeURIComponent(q.trim()))

  const queryString = params.toString()
  const newHash = queryString ? `#/?${queryString}` : '#/'

  // Only update if different (avoid infinite loops)
  if (window.location.hash !== newHash) {
    window.history.replaceState(null, '', newHash)
  }
}
