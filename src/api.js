const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function get(path) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`)
  } catch (e) {
    throw new Error(`Network request failed to ${API_BASE}${path}: ${e.message}`)
  }

  if (!res.ok) throw new Error('Network error')
  return res.json()
}

async function post(path, body) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  } catch (e) {
    throw new Error(`Network request failed to ${API_BASE}${path}: ${e.message}`)
  }

  // Try to parse JSON body for success or error messages
  const contentType = res.headers.get('content-type') || ''
  let payload
  try {
    payload = contentType.includes('application/json') ? await res.json() : await res.text()
  } catch (e) {
    payload = null
  }

  if (!res.ok) {
    const errMessage = (payload && payload.error) || (typeof payload === 'string' && payload) || 'Network error'
    const err = new Error(errMessage)
    err.status = res.status
    err.payload = payload
    throw err
  }

  return payload
}

export { API_BASE, get, post }
