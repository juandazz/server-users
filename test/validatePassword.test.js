import { validatePassword } from './password-validator.js';

test('Contraseña válida', () => {
    expect(validatePassword('Passw0rd!')).toBe(true);
});

test('Falta mayúscula', () => {
    expect(validatePassword('password1!')).toBe(false);
});

test('Falta número', () => {
    expect(validatePassword('Password!')).toBe(false);
});

test('Falta carácter especial', () => {
    expect(validatePassword('Password1')).toBe(false);
});

test('Longitud insuficiente', () => {
    expect(validatePassword('Pw1!')).toBe(false);
});
