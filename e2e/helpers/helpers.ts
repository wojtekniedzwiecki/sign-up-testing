
export function generateTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
  }
  
  export function generateLastUpdatedOnTime(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
  
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1); // Months are 0-indexed
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
  
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  }
  
  
  export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  