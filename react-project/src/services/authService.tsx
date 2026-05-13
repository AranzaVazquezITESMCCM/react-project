export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Obtener todos los usuarios
export const getUsers = (): User[] => {
  const users = localStorage.getItem('smarthome_users');
  return users ? JSON.parse(users) : [];
};

// Registrar nuevo usuario
export const registerUser = (name: string, email: string, password: string): { success: boolean; message: string } => {
  const users = getUsers();
  
  // Verificar si el email ya existe
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already exists' };
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password // En producción deberías encriptar esto
  };
  
  users.push(newUser);
  localStorage.setItem('smarthome_users', JSON.stringify(users));
  return { success: true, message: 'Registration successful' };
};

// Login
export const loginUser = (email: string, password: string): { success: boolean; user?: User; message: string } => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Guardar sesión actual
    localStorage.setItem('smarthome_current_user', JSON.stringify(user));
    return { success: true, user, message: 'Login successful' };
  }
  
  return { success: false, message: 'Invalid email or password' };
};

// Obtener usuario actual
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('smarthome_current_user');
  return user ? JSON.parse(user) : null;
};

// Logout
export const logoutUser = (): void => {
  localStorage.removeItem('smarthome_current_user');
};

// Actualizar perfil
export const updateUserProfile = (userId: string, name: string, email: string): { success: boolean; message: string } => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  // Verificar si el nuevo email ya existe (excepto el email actual)
  if (users.find(u => u.email === email && u.id !== userId)) {
    return { success: false, message: 'Email already exists' };
  }
  
  users[userIndex].name = name;
  users[userIndex].email = email;
  
  localStorage.setItem('smarthome_users', JSON.stringify(users));
  
  // Actualizar usuario actual
  localStorage.setItem('smarthome_current_user', JSON.stringify(users[userIndex]));
  
  return { success: true, message: 'Profile updated successfully' };
};