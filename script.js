/* ==========================================================
   Student Portfolio - JavaScript
   1) Mobile menu  2) Academic planner  3) Contact validation
   ========================================================== */

/* ---------- 1) Mobile navigation toggle ---------- */
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('navList');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
}

/* ---------- 2) Academic planner (only runs on planner.html) ---------- */
const taskForm = document.getElementById('taskForm');
if (taskForm) {
  const taskList = document.getElementById('taskList');
  const counter = document.getElementById('taskCounter');
  const errorBox = document.getElementById('taskError');

  // The array that holds every task object: {id, title, course, due, done}
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem('tasks')) || []; } catch (e) { tasks = []; }

  // Save the array so tasks survive a page refresh
  function save() {
    try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) { /* storage unavailable */ }
  }

  // Add a task to the array
  function addTask(title, course, due) {
    tasks.push({ id: Date.now(), title, course, due, done: false });
    save(); render();
  }

  // Flip the completed state of one task
  function toggleTask(id) {
    const t = tasks.find(task => task.id === id);
    if (t) t.done = !t.done;
    save(); render();
  }

  // Remove a task from the array
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    save(); render();
  }

  // Rebuild the list in the DOM from the array
  function render() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
      taskList.innerHTML = '<li class="empty">No tasks yet. Add your first one above.</li>';
    }
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task' + (task.done ? ' done' : '');

      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = task.done;
      box.setAttribute('aria-label', 'Mark "' + task.title + '" as completed');
      box.addEventListener('change', () => toggleTask(task.id));

      const info = document.createElement('div');
      info.className = 'info';
      const title = document.createElement('span');
      title.className = 'title';
      title.textContent = task.title;           // textContent avoids HTML injection
      const meta = document.createElement('small');
      meta.textContent = [task.course, task.due ? 'Due ' + task.due : ''].filter(Boolean).join(' - ');
      info.append(title, document.createElement('br'), meta);

      const del = document.createElement('button');
      del.className = 'btn small ghost';
      del.textContent = 'Delete';
      del.addEventListener('click', () => deleteTask(task.id));

      li.append(box, info, del);
      taskList.appendChild(li);
    });
    const done = tasks.filter(t => t.done).length;
    counter.textContent = tasks.length ? done + ' of ' + tasks.length + ' tasks completed' : '';
  }

  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    if (!title) { errorBox.textContent = 'Enter a task name before adding.'; return; }
    errorBox.textContent = '';
    addTask(title, document.getElementById('taskCourse').value.trim(), document.getElementById('taskDate').value);
    taskForm.reset();
  });

  render();
}

/* ---------- 3) Contact form validation (only runs on contact.html) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const status = document.getElementById('formStatus');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;   // simple email format check
  const digitsOnly = /^\d+$/;                              // digits only

  // Show or clear the error for one field
  function setError(id, message) {
    document.getElementById(id + 'Error').textContent = message;
    document.getElementById(id).classList.toggle('invalid', Boolean(message));
    return !message;
  }

  // Each rule returns an error message, or '' when the field is valid
  const rules = {
    name:    v => v ? '' : 'Enter your name.',
    email:   v => !v ? 'Enter your email address.' : (emailPattern.test(v) ? '' : 'Enter a valid email, like name@example.com.'),
    phone:   v => !v ? 'Enter your phone number.' : (digitsOnly.test(v) ? '' : 'Use digits only (no spaces, + or dashes).'),
    message: v => v ? '' : 'Write a message.'
  };

  function validateField(id) {
    return setError(id, rules[id](document.getElementById(id).value.trim()));
  }

  // Validate live once the user leaves a field
  Object.keys(rules).forEach(id => document.getElementById(id).addEventListener('blur', () => validateField(id)));

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const allValid = Object.keys(rules).map(validateField).every(Boolean);
    status.className = 'form-status ' + (allValid ? 'success' : 'fail');
    if (allValid) {
      status.textContent = 'Message sent. Thank you, ' + document.getElementById('name').value.trim() + '! I will reply soon.';
      contactForm.reset();
    } else {
      status.textContent = 'Please fix the highlighted fields and send again.';
    }
  });
}
