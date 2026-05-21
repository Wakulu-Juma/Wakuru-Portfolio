import { API_BASE } from './api'

const tokenKey = 'wakuru-admin-token'

export function setAdminToken(token) {
  if (typeof window === 'undefined') {
    return
  }

  if (!token) {
    window.localStorage.removeItem(tokenKey)
    return
  }

  window.localStorage.setItem(tokenKey, token)
}

export function getAdminToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(tokenKey) || ''
}

async function adminRequest(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  const response = await fetch(`${API_BASE}/api/admin${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    }
  })

  if (!response.ok) {
    // try to include server error message for clearer UI feedback
    let text = ''
    try {
      const payload = await response.json()
      text = payload?.error || payload?.message || JSON.stringify(payload)
    } catch (err) {
      try {
        text = await response.text()
      } catch (e) {
        text = 'Admin request failed'
      }
    }

    const err = new Error(text || 'Admin request failed')
    err.status = response.status
    throw err
  }

  const payload = await response.json()
  return payload?.data ?? payload
}

export function adminGet(path) {
  return adminRequest(path)
}

export function adminPost(path, body) {
  return adminRequest(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body)
  })
}

export function adminPut(path, body) {
  return adminRequest(path, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body)
  })
}

export function adminDelete(path) {
  return adminRequest(path, {
    method: 'DELETE'
  })
}