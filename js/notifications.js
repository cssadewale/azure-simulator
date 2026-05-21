/* =====================================================
   NOTIFICATIONS.JS
   ===================================================== */

function openNotifications() {
  const panel = document.getElementById('notificationPanel');
  panel.classList.toggle('open');
  renderNotifications();
}

function closeNotifications() {
  document.getElementById('notificationPanel').classList.remove('open');
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  list.innerHTML = AzureData.notifications.map(n => `
    <div class="notif-item ${n.type}">
      <div class="notif-item-title">${n.title}</div>
      <div style="font-size:12px;color:#605e5c;margin-top:3px">${n.message}</div>
      <div class="notif-item-time">${n.time}</div>
    </div>
  `).join('') || '<div style="padding:20px;text-align:center;color:#8a8886;font-size:13px">No notifications</div>';
}
