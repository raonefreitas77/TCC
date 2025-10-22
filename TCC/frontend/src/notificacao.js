
const icons = {
  erro: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  warning: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
  success: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  info: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
};

const closeIcon = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';



export function showNotification(type = 'info', message = '', duration = 4000) {
  const container = document.getElementById('notification-container');
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">${icons[type]}</div>
      <div class="notification-text">${message}</div>
      <button class="notification-close">${closeIcon}</button>
    </div>
    <div class="notification-progress">
      <div class="notification-progress-bar"></div>
    </div>
  `;


  container.appendChild(notification);
  
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => removeNotification(notification));
  
  setTimeout(() => {
    removeNotification(notification);
  }, duration);
}


function removeNotification(notification) {
  notification.classList.add('removing');
  setTimeout(() => {
    notification.remove();
  }, 300);
}