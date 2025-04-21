export const generatePassword = (): string => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const allChars = upper + lower + numbers;
  
    let password = "";
  
    // Garante pelo menos uma letra maiúscula
    password += upper[Math.floor(Math.random() * upper.length)];
  
    // Preenche o restante (7 caracteres restantes)
    for (let i = 0; i < 7; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
  
    // Embaralha os caracteres (pra não deixar a maiúscula sempre na primeira posição)
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };