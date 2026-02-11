export const generateRecoveryCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

export interface User {
  username: string;
  password: string;
  recoveryCode: string;
}

export const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const findUser = (username: string): User | undefined => {
  return getUsers().find(u => u.username === username);
};

export const validateLogin = (username: string, password: string): boolean => {
  const user = findUser(username);
  return user ? user.password === password : false;
};

export const resetPassword = (username: string, recoveryCode: string, newPassword: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username && u.recoveryCode === recoveryCode);
  
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
  return false;
};

export const resetPasswordByCode = (recoveryCode: string, newPassword: string): { success: boolean; username?: string } => {
  const users = getUsers();
  // Normalize recovery code to uppercase for comparison
  const normalizedCode = recoveryCode.toUpperCase().trim();
  const userIndex = users.findIndex(u => u.recoveryCode.toUpperCase().trim() === normalizedCode);
  
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, username: users[userIndex].username };
  }
  return { success: false };
};

export const updateUserPassword = (username: string, newPassword: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username);
  
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
  return false;
};
