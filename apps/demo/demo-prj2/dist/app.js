const defaults = [
  { id: 1, title: '발표 흐름을 5장으로 압축하기', duration: 25, priority: '높음', done: false },
  { id: 2, title: '사용자 테스트 질문 정리하기', duration: 25, priority: '보통', done: false },
  { id: 3, title: '내일 회의의 논점 미리 적어두기', duration: 15, priority: '낮음', done: true }
];
const state = JSON.parse(localStorage.getItem('focus-pulse-state') || 'null') || { tasks: defaults, completedSessions: 2, minutes: 50, theme: 'dark' };
let seconds = 25 * 60, totalSeconds = seconds, interval = null;
const $ = (s) => document.querySelector(s);

function save() { localStorage.setItem('focus-pulse-state', JSON.stringify(state)); }
function render() {
  const list = $('#taskList');
  list.innerHTML = state.tasks.map((task) => `<li class="task ${task.done ? 'done' : ''}"><input class="task-check" type="checkbox" data-id="${task.id}" ${task.done ? 'checked' : ''} aria-label="${task.title} 완료" /><div><div class="task-title">${task.title}</div><div class="task-meta">${task.duration} MIN FOCUS</div></div><span class="priority ${task.priority === '높음' ? 'high' : ''}">${task.priority}</span></li>`).join('');
  const done = state.tasks.filter((t) => t.done).length;
  $('#taskNavCount').textContent = String(state.tasks.length).padStart(2, '0');
  $('#taskStat').textContent = done;
  $('#minuteStat').textContent = state.minutes;
  $('#completedCount').textContent = state.completedSessions;
  $('#remainingText').textContent = `${Math.max(0, 5 - state.completedSessions)}번의 집중`;
  updateTimer(); save();
}
function updateTimer() {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0'); const sec = String(seconds % 60).padStart(2, '0');
  $('#timeDisplay').textContent = `${min}:${sec}`;
  $('#ringValue').style.strokeDashoffset = 603 * (1 - seconds / totalSeconds);
}
function stopTimer() { clearInterval(interval); interval = null; $('#startButton').innerHTML = '세션 시작 <span>→</span>'; $('#timerStatus').textContent = '준비 완료'; }
function completeSession() { stopTimer(); state.completedSessions += 1; state.minutes += Math.round(totalSeconds / 60); seconds = totalSeconds; $('#timerStatus').textContent = '세션 완료!'; render(); }
$('#startButton').addEventListener('click', () => { if (interval) return stopTimer(); $('#startButton').innerHTML = '일시 정지 <span>Ⅱ</span>'; $('#timerStatus').textContent = '몰입 중…'; interval = setInterval(() => { seconds -= 1; updateTimer(); if (seconds <= 0) completeSession(); }, 1000); });
$('#resetButton').addEventListener('click', () => { stopTimer(); seconds = totalSeconds; updateTimer(); });
$('#modeButton').addEventListener('click', () => { const choices = [25, 50, 15]; const current = totalSeconds / 60; const next = choices[(choices.indexOf(current) + 1) % choices.length]; totalSeconds = seconds = next * 60; $('#modeButton').textContent = `${next}분 집중 ▾`; stopTimer(); updateTimer(); });
$('#taskList').addEventListener('change', (e) => { const id = Number(e.target.dataset.id); const task = state.tasks.find((t) => t.id === id); if (task) { task.done = e.target.checked; render(); } });
$('#openTaskDialog').addEventListener('click', () => $('#taskDialog').showModal());
$('#taskForm').addEventListener('submit', (e) => { e.preventDefault(); const form = new FormData(e.currentTarget); state.tasks.unshift({ id: Date.now(), title: form.get('title').trim(), duration: Number(form.get('duration')), priority: '보통', done: false }); $('#taskDialog').close(); e.currentTarget.reset(); render(); });
$('#themeToggle').addEventListener('click', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; document.documentElement.classList.toggle('light', state.theme === 'light'); save(); });
document.documentElement.classList.toggle('light', state.theme === 'light');
$('#dateLabel').textContent = new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric', weekday:'long' }).format(new Date()).toUpperCase();
render();
