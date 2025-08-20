// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(localStorage.getItem('token') || null);

//   // Login: POST to backend, save token if successful
//   const login = async (username, password) => {
//     try {
//       const res = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });
//       const data = await res.json();
//       if (res.ok && data.token) {
//         setToken(data.token);
//         localStorage.setItem('token', data.token);
//         return true;
//       }
//       return false;
//     } catch {
//       return false;
//     }
//   };

//   // Signup: POST to backend, auto-login if successful
//   const signup = async (username, email, password) => {
//     try {
//       const res = await fetch('http://localhost:5000/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, email, password }),
//       });
//       if (res.ok) {
//         // Optionally auto-login after signup
//         return await login(username, password);
//       }
//       return false;
//     } catch {
//       return false;
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
//}