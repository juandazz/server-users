
const forbiddenWords = [
    "Asesinato","Asno","Drogas",   
];

const validateUsername = (username) => {
    const lowerUsername = username.toLowerCase();

    for (const word of forbiddenWords) {
        if (lowerUsername.includes(word)) {
            return false;
        }
    }

    return true;
}

test('Nombre de usuario válido', () => {
    expect(validateUsername('usuarioNormal')).toBe(true);
});

test('Nombre de usuario con grosería', () => {
    expect(validateUsername('Asesinato')).toBe(false);
});

test('Nombre de usuario en mayúsculas con grosería', () => {
    expect(validateUsername('DROGAS')).toBe(false);
});
