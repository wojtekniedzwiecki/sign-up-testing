
export function generateTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds())}`;
  }
  
  export function generateRandomEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    return `testuser+${timestamp}${random}@example.com`;
  }  

  export function generateStrongPassword(length = 12): string {
    if (length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()-+=';
  
    const allChars = uppercase + lowercase + numbers + special;
  
    // Ensure each required character type is included
    const passwordChars = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      special[Math.floor(Math.random() * special.length)],
    ];
  
    // Fill the rest of the password length with random characters
    for (let i = passwordChars.length; i < length; i++) {
      passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
  
    // Shuffle the array to avoid predictable order
    for (let i = passwordChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }
  
    return passwordChars.join('');
  }
  
  
  export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  