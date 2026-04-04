import * as bcrypt from 'bcrypt';
import { AUTH_BCRYPT_SALT_ROUNDS } from '../auth.constants';

export const hashPassword = async (plainPassword: string) =>
  bcrypt.hash(plainPassword, AUTH_BCRYPT_SALT_ROUNDS);

export const comparePassword = async (
  plainPassword: string,
  passwordHash: string,
) => bcrypt.compare(plainPassword, passwordHash);
