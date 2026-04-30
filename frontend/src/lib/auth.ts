export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const login = (token: string, role: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.removeItem('token');
};