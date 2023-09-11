export function startKeyListener(callback) {
    document.addEventListener('keydown', callback);
  }
  
  export function stopKeyListener(callback) {
    document.removeEventListener('keydown', callback);
  }
  