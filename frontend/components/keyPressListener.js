export function startKeyListener(callback) {
    document.addEventListener('keydown', callback);
    document.addEventListener('mousedown', callback)
}
  
export function stopKeyListener(callback) {
    document.removeEventListener('keydown', callback);
    document.removeEventListener('mousedown', callback)
}

export function startKeyUpListener(callback) {
    document.addEventListener('keyup', callback);
    document.addEventListener('mouseup', callback);
}

export function stopKeyUpListener(callback) {
    document.removeEventListener('keyup', callback);
    document.removeEventListener('mouseup', callback);
}