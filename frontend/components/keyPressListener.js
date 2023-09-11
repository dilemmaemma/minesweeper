export function startKeyListener(callback) {
    document.addEventListener('keydown', callback);
    document.addEventListener('mousedown', callback)
}
  
export function stopKeyListener(callback) {
    document.removeEventListener('keydown', callback);
    document.removeEventListener('mousedown', callback)

}
  