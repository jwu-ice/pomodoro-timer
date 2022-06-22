import { TimerModel } from "./TimerModel.js";

class TimerView {
  constructor(timerModel, todoView) {
    this.model = timerModel;
    this.todoView = todoView;

    this.time = this.model.timerTime * 60;
    this.breakTime = this.model.breakTimerTime * 60;

    this.setTimer = null;
    this.pomodoroCount = 1;
    this.focusValue = this.todoView.focusValue;
    this.studySound = new Audio();

    this.addEvent();
    this.updateTimer();
  }

  addEvent() {
    this.$("#timerPage").addEventListener(
      "click",
      this.eventHandler.bind(this)
    );
    this.$(".openbtn").addEventListener("click", this.openSideBar.bind(this));
    this.$(".closebtn").addEventListener("click", this.closeSideBar.bind(this));
    this.$(".optionTimer").addEventListener(
      "click",
      this.submitOptionTimer.bind(this)
    );
  }

  eventHandler(e) {
    const action = e.target.dataset.action;
    if (action) this[action]();
  }

  $(selector) {
    return document.querySelector(selector);
  }

  playBtn() {
    this.toggleBtnList();
    this.updateTimer();
    this.pomodoroTime();
  }
  pomodoroTime() {
    this.setTimer = setInterval((e) => {
      if (this.time <= 6) {
        this.$("#time").classList.add("warning");
      }

      if (this.time < 1) {
        clearInterval(this.setTimer);
        this.pomodoroCount++;
        this.togglesBreakTime();
        this.$("#time").classList.remove("warning");
        if (this.pomodoroCount % 2 === 1) {
          this.studySound.src = `./CSS/sound/studyTime.wav`;
          this.studySound.volume = 0.5;
          this.studySound.play();

          this.time = this.model.timerTime * 60;
          this.pomodoroTime();
        } else {
          this.studySound.src = `./CSS/sound/breakTime.wav`;
          this.studySound.volume = 0.5;
          this.studySound.play();

          this.time = this.model.breakTimerTime * 60;
          this.pomodoroTime();
        }
      }
      this.time--;
      this.progressBar(this.time);
      this.updateTimer();
    }, 1000);
  }

  pauseSound() {
    this.studySound.pause();
  }

  stopBtn() {
    this.toggleBtnList();
    this.pauseSound();
    clearInterval(this.setTimer);
  }

  refreshBtn() {
    clearInterval(this.setTimer);
    this.pauseSound();
    this.pomodoroCount = 1;
    this.toggleBtnList();
    this.$("#timerPage").classList.remove("hidden");
    this.$("#time").classList.remove("warning");
    this.time = this.model.timerTime * 60;
    this.progressBar();
    this.updateTimer();
  }

  toggleBtnList() {
    this.$("#playBtn").classList.toggle("hide");
    this.$("#stopBtn").classList.toggle("hide");
    this.$("#refreshBtn").classList.toggle("hide");
  }

  updateTimer() {
    const min = Math.floor(this.time / 60);
    const sec = Math.floor(this.time % 60);
    this.$("#time").innerHTML = `${this.time < 600 ? 0 : ""}${min}:${
      sec < 10 ? 0 : ""
    }${sec}`;
  }

  progressBar() {
    const $bar = this.$("#barStatus");
    let max = 0;

    if (this.pomodoroCount % 2 === 1) {
      max = this.model.timerTime * 60;
    } else {
      max = this.model.breakTimerTime * 60;
    }
    $bar.style.width = ((max - this.time) / max) * 100 + "%";
  }

  submitOptionTimer(e) {
    e.preventDefault();
    const studyTime = this.$(".inputStudyTime").value.trim();
    const breakTime = this.$(".inputBreakTime").value.trim();

    if (!Number(studyTime) || !Number(breakTime)) {
      return;
    }
    if (!this.$("#playBtn").classList.contains("hide")) {
      this.toggleBtnList();
    }

    this.model.timerTime = studyTime;
    this.model.breakTimerTime = breakTime;

    this.refreshBtn();
    this.closeSideBar();
  }

  togglesBreakTime() {
    this.$("#timerPage").classList.toggle("hidden");
  }

  openSideBar() {
    this.$("#mySidenav").classList.add("open");
  }

  closeSideBar() {
    this.$("#mySidenav").classList.remove("open");
  }
}

export { TimerView, TimerModel };
