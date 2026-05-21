const DEFAULT_BASE_URL = 'https://backend-potfolio-37dj.onrender.com'

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || DEFAULT_BASE_URL

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })

  if (!response.ok) {
    // Try to surface backend error message for easier debugging
    let errText = 'Request failed'
    try {
      const errPayload = await response.json()
      if (errPayload && (errPayload.error || errPayload.message)) {
        errText = errPayload.error || errPayload.message
      }
    } catch (e) {
      // ignore parse errors, keep generic message
    }

    throw new Error(errText)
  }

  const payload = await response.json()
  return payload?.data ?? payload
}

export function get(path) {
  return request(path)
}

export function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export function put(path, body) {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body)
  })
}

export function del(path) {
  return request(path, {
    method: 'DELETE'
  })
}