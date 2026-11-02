import './day-tabs.js';
import './workout-timeline.js';
import './muscle-map.js';
import { currentDayIndex, loadWorkoutData } from '../lib/workout-data.js';

class WorkoutDashboard extends HTMLElement {
  async connectedCallback() {
    this.data = await loadWorkoutData();
    this.selectedDay = currentDayIndex(this.data.days);
    this.selectedExercise = 0;
    this.render();
  }

  render() {
    const day = this.data.days[this.selectedDay];
    const today = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' }).format(new Date()).toUpperCase().replace('.', '');
    this.innerHTML = `
      <section class="dashboard-section section-shell" id="treino">
        <div class="section-heading"><div><p class="eyebrow">AGENDA INTELIGENTE</p><h2>Seu treino, no tempo certo.</h2></div><div class="today-stamp"><span>HOJE</span><strong>${today}</strong></div></div>
        <day-tabs></day-tabs>
        <div class="workout-grid"><workout-timeline></workout-timeline><muscle-map></muscle-map></div>
      </section>`;
    const tabs = this.querySelector('day-tabs');
    tabs._selected = this.selectedDay;
    tabs.days = this.data.days;
    const timeline = this.querySelector('workout-timeline');
    timeline._selectedIndex = this.selectedExercise;
    timeline.model = { day, defaults: this.data.defaults };
    this.querySelector('muscle-map').exercise = day.exercises[this.selectedExercise] || null;
    this.addEventListener('day-change', this.changeDay, { once: true });
    this.addEventListener('exercise-change', this.changeExercise, { once: true });
  }

  changeDay = event => {
    this.selectedDay = event.detail;
    this.selectedExercise = 0;
    this.render();
  };

  changeExercise = event => {
    this.selectedExercise = event.detail;
    const day = this.data.days[this.selectedDay];
    const timeline = this.querySelector('workout-timeline');
    timeline.selectedIndex = this.selectedExercise;
    this.querySelector('muscle-map').exercise = day.exercises[this.selectedExercise];
    this.addEventListener('exercise-change', this.changeExercise, { once: true });
  };
}

customElements.define('workout-dashboard', WorkoutDashboard);
