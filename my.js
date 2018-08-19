'use strict';

const clockFace = document.querySelector('.js-time');
const startBtn = document.querySelector('.js-start');
const takeLapBtn = document.querySelector('.js-take-lap');
const resetBtn = document.querySelector('.js-reset');
const laps = document.querySelector('.js-laps');

class Timer {
  constructor({
    onTick,
    toggleBtn
  }) {
    this.startTime = null;
    this.pauseTime = null;
    this.deltaTime = 0;
    this.lapTime = null;
    this.timerId = null;
    this.isTimerActive = false;
    this.onTick = onTick;
    this.toggleBtn = toggleBtn;
    resetBtn.disabled = true;
    takeLapBtn.disabled = true;
  }

  start() {
    resetBtn.disabled = false;
    takeLapBtn.disabled = false;
    if (!this.isTimerActive) {
      this.startTime = Date.now() - this.deltaTime;
      this.timerId = setInterval(() => {
        this.calcTime();
      }, 100);
    } else {
      takeLapBtn.disabled = true;
      this.stop();
    }
    this.isTimerActive = !this.isTimerActive;
    this.toggleBtn(this.isTimerActive);
  }
  calcTime() {
    const currentTime = Date.now();
    this.deltaTime = currentTime - this.startTime;
    const time = new Date(this.deltaTime);
    const min = time.getMinutes();
    const sec = time.getSeconds();
    const ms = Number.parseInt(time.getMilliseconds() / 100);
    console.log('Таймер обновляется раз в 100мс');
    this.onTick({
      min: min,
      sec: sec,
      ms: ms,
    });
  }

  stop() {
    clearInterval(this.timerId);
  }
  newLap() {
    let lapsTime = clockFace.innerText;
    laps.innerHTML += `<li class="lap">${lapsTime}</li><hr>`;
  }

  reset() {
    this.isTimerActive = false;
    clearInterval(this.timerId);
    this.deltaTime = 0;
    this.toggleBtn(null);
    this.onTick({
      min: 0,
      sec: 0,
      ms: 0,
    });
    resetBtn.disabled = true;
    takeLapBtn.disabled = true;
    laps.innerHTML = null;
  }
}

const timer = new Timer({
  onTick: updateClockFace,
  toggleBtn: toggleBtn,
});

startBtn.addEventListener('click', timer.start.bind(timer));
takeLapBtn.addEventListener('click', timer.newLap.bind(timer));
resetBtn.addEventListener('click', timer.reset.bind(timer));

updateClockFace({
  min: 0,
  sec: 0,
  ms: 0
});

function updateClockFace({
  min,
  sec,
  ms
}) {
  min = `${min}`.padStart(2, '0'),
    sec = `${sec}`.padStart(2, '0'),
    ms = `${ms}`.padStart(2, '0'),
    clockFace.textContent = `${(min)}:${(sec)}.${ms}`;
}


function toggleBtn(isActive) {
  startBtn.classList.toggle('active');
  const isBtnActive = startBtn.classList.contains('active');
  if (isBtnActive && isActive === true) {
    startBtn.textContent = 'Pause';
  } else if (!isBtnActive && isActive === false) {
    startBtn.textContent = 'Continue';
  } else {
    startBtn.textContent = 'Start';
    startBtn.classList.remove('active');
  }
}