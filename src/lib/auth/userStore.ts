import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type UserRole = 'admin' | 'super_admin';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  organization: string;
  title: string;
  isActive: boolean;
  lastLoginAt: string | null;
  resetCode: string | null;
  resetCodeExpiry: number | null;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<UserRecord, 'passwordHash' | 'salt' | 'resetCode' | 'resetCodeExpiry'>;

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'admin_users.json');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function ensureDataStore(): UserRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(USERS_FILE)) {
      // Seed default Master Administrator
      const salt = generateSalt();
      const defaultUser: UserRecord = {
        id: 'usr_admin_master_01',
        name: 'Manzi Gatabazi Pacifique',
        email: 'p.gatabazi@alustudent.com',
        username: 'pacifique',
        passwordHash: hashPassword('manzi@uzzy', salt),
        salt,
        role: 'super_admin',
        organization: 'African Leadership University / CB-FVT Core',
        title: 'Data Operations & ETL Lead',
        isActive: true,
        lastLoginAt: null,
        resetCode: null,
        resetCodeExpiry: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const initialData = [defaultUser];
      fs.writeFileSync(USERS_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }

    // Re-seed if empty
    const salt = generateSalt();
    const defaultUser: UserRecord = {
      id: 'usr_admin_master_01',
      name: 'Manzi Gatabazi Pacifique',
      email: 'p.gatabazi@alustudent.com',
      username: 'pacifique',
      passwordHash: hashPassword('manzi@uzzy', salt),
      salt,
      role: 'super_admin',
      organization: 'African Leadership University / CB-FVT Core',
      title: 'Data Operations & ETL Lead',
      isActive: true,
      lastLoginAt: null,
      resetCode: null,
      resetCodeExpiry: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify([defaultUser], null, 2), 'utf-8');
    return [defaultUser];
  } catch (err) {
    console.error('[UserStore] Error ensuring data store:', err);
    return [];
  }
}

function saveUsers(users: UserRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[UserStore] Error writing users file:', err);
    throw new Error('Failed to persist user database.');
  }
}

export function toSafeUser(user: UserRecord): SafeUser {
  const { passwordHash, salt, resetCode, resetCodeExpiry, ...safe } = user;
  return safe;
}

export const UserStore = {
  listUsers(): SafeUser[] {
    const users = ensureDataStore();
    return users.map(toSafeUser);
  },

  findById(id: string): UserRecord | null {
    const users = ensureDataStore();
    return users.find((u) => u.id === id) || null;
  },

  findByIdentifier(identifier: string): UserRecord | null {
    const users = ensureDataStore();
    const clean = identifier.trim().toLowerCase();
    return (
      users.find(
        (u) =>
          u.email.toLowerCase() === clean ||
          u.username.toLowerCase() === clean ||
          (clean === 'pacifique.manzi@alu.edu' && u.email === 'p.gatabazi@alustudent.com')
      ) || null
    );
  },

  verifyPassword(user: UserRecord, candidatePassword: string): boolean {
    const hash = hashPassword(candidatePassword, user.salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.passwordHash, 'hex'));
  },

  createUser(params: {
    name: string;
    email: string;
    username: string;
    password: string;
    role?: UserRole;
    organization?: string;
    title?: string;
  }): SafeUser {
    const users = ensureDataStore();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanUsername = params.username.trim().toLowerCase();

    // Check unique constraints
    const existing = users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername
    );
    if (existing) {
      throw new Error('An administrator with this email or username already exists.');
    }

    const salt = generateSalt();
    const newUser: UserRecord = {
      id: `usr_admin_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      name: params.name.trim(),
      email: cleanEmail,
      username: cleanUsername,
      passwordHash: hashPassword(params.password.trim(), salt),
      salt,
      role: params.role || 'admin',
      organization: params.organization || 'African Leadership University / CB-FVT Core',
      title: params.title || 'Data Operations Analyst',
      isActive: true,
      lastLoginAt: null,
      resetCode: null,
      resetCodeExpiry: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    return toSafeUser(newUser);
  },

  updateUser(
    id: string,
    updates: Partial<{
      name: string;
      email: string;
      username: string;
      role: UserRole;
      organization: string;
      title: string;
      isActive: boolean;
      password?: string;
    }>
  ): SafeUser {
    const users = ensureDataStore();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('Administrator not found.');
    }

    const user = users[index];

    if (updates.email && updates.email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const emailCollision = users.find(
        (u) => u.id !== id && u.email.toLowerCase() === updates.email!.trim().toLowerCase()
      );
      if (emailCollision) {
        throw new Error('Email address is already in use by another administrator.');
      }
      user.email = updates.email.trim().toLowerCase();
    }

    if (updates.username && updates.username.trim().toLowerCase() !== user.username.toLowerCase()) {
      const usernameCollision = users.find(
        (u) => u.id !== id && u.username.toLowerCase() === updates.username!.trim().toLowerCase()
      );
      if (usernameCollision) {
        throw new Error('Username is already taken.');
      }
      user.username = updates.username.trim().toLowerCase();
    }

    if (updates.name !== undefined) user.name = updates.name.trim();
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.organization !== undefined) user.organization = updates.organization.trim();
    if (updates.title !== undefined) user.title = updates.title.trim();
    if (updates.isActive !== undefined) user.isActive = updates.isActive;

    if (updates.password && updates.password.trim().length > 0) {
      user.salt = generateSalt();
      user.passwordHash = hashPassword(updates.password.trim(), user.salt);
    }

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);
    return toSafeUser(user);
  },

  deleteUser(id: string): { success: boolean; message: string } {
    const users = ensureDataStore();
    const target = users.find((u) => u.id === id);
    if (!target) {
      throw new Error('Administrator not found.');
    }

    // Safety guard: cannot delete the last super_admin
    const superAdmins = users.filter((u) => u.role === 'super_admin' && u.isActive);
    if (target.role === 'super_admin' && superAdmins.length <= 1) {
      throw new Error('Cannot delete the primary active Super Administrator. Assign another Super Admin first.');
    }

    const filtered = users.filter((u) => u.id !== id);
    saveUsers(filtered);
    return { success: true, message: `Administrator ${target.name} removed successfully.` };
  },

  recordLogin(id: string): void {
    const users = ensureDataStore();
    const user = users.find((u) => u.id === id);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      saveUsers(users);
    }
  },

  requestPasswordReset(email: string): { success: boolean; resetCode: string; expiryMinutes: number } {
    const users = ensureDataStore();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        (cleanEmail === 'pacifique.manzi@alu.edu' && u.email === 'p.gatabazi@alustudent.com')
    );

    if (!user) {
      throw new Error('No administrator found with this email address.');
    }

    // Generate 6-digit numeric reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMinutes = 15;
    user.resetCode = resetCode;
    user.resetCodeExpiry = Date.now() + expiryMinutes * 60 * 1000;

    saveUsers(users);
    return { success: true, resetCode, expiryMinutes };
  },

  confirmPasswordReset(email: string, code: string, newPassword: string): { success: boolean; message: string } {
    const users = ensureDataStore();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        (cleanEmail === 'pacifique.manzi@alu.edu' && u.email === 'p.gatabazi@alustudent.com')
    );

    if (!user) {
      throw new Error('No administrator account found.');
    }

    if (!user.resetCode || !user.resetCodeExpiry) {
      throw new Error('No password reset requested or reset session expired.');
    }

    if (Date.now() > user.resetCodeExpiry) {
      user.resetCode = null;
      user.resetCodeExpiry = null;
      saveUsers(users);
      throw new Error('Password reset code has expired. Please request a new one.');
    }

    if (user.resetCode.trim() !== code.trim()) {
      throw new Error('Invalid verification code.');
    }

    // Set new password
    user.salt = generateSalt();
    user.passwordHash = hashPassword(newPassword.trim(), user.salt);
    user.resetCode = null;
    user.resetCodeExpiry = null;
    user.updatedAt = new Date().toISOString();

    saveUsers(users);
    return { success: true, message: 'Password reset successfully. You may now log in with your new credentials.' };
  },
};
