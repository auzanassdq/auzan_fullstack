const API_BASE = 'http://localhost:3001/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  getUnits: () => request('/units'),
  getRooms: () => request('/rooms'),
  getRoom: (id) => request(`/rooms/${id}`),
  getBookings: (page = 1, limit = 10) => request(`/bookings?page=${page}&limit=${limit}`),
  createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  deleteBooking: (id) => request(`/bookings/${id}`, { method: 'DELETE' }),
};
