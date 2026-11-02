import { buildTimeline } from '../lib/time.js';

class WorkoutTimeline extends HTMLElement {
  set model(value) { this._model = value; this.render(); }
  set selectedIndex(value) { this._selectedIndex = value; this.render(); }

  render() {
    if (!this._model) return;
    const { day, defaults } = this._model;
    const savedTime = localStorage.getItem('atlas-start-time') || defaults.startTime;
    const totalMinutes = day.exercises.reduce((sum, exercise) => sum + exercise.duration, defaults.warmupMinutes);
    const totalSets = day.exercises.reduce((sum, exercise) => sum + exercise.series, 0);
    const session = day.exercises.length ? `
      <div class="session-meta"><span><i></i>${day.exercises.length} EXERCÍCIOS</span><span><i></i>${totalSets} SÉRIES</span><span><i></i>≈ ${totalMinutes} MIN</span></div>
      <div class="warmup-note"><span class="warmup-icon" aria-hidden="true">↗</span><div><strong>${defaults.warmupTitle}</strong><p>${defaults.warmupDescription}</p></div></div>
      <div class="timeline">${buildTimeline(day.exercises, savedTime, defaults.warmupMinutes).map((exercise, index) => `
        <button class="timeline-item ${index === this._selectedIndex ? 'active' : ''}" data-index="${index}" aria-label="${exercise.name}, ${exercise.series} séries de ${exercise.reps}, começa às ${exercise.start}">
          <span class="timeline-time">${exercise.start}</span><span class="timeline-track"><i class="timeline-dot"></i></span>
          <span class="exercise-info"><strong>${exercise.name}</strong><small>${exercise.series} × ${exercise.reps} · ${exercise.duration} MIN</small></span>
          <span class="exercise-tags">${exercise.muscles.slice(0, 2).map(muscle => `<i>${muscle}</i>`).join('')}</span>
        </button>`).join('')}</div>` : `
      <div class="rest-day"><div class="rest-symbol">◌</div><h4>Hoje, crescer é descansar.</h4><p>Priorize sono, hidratação e uma caminhada leve. O próximo ciclo começa com energia renovada.</p></div>`;

    this.innerHTML = `
      <article class="schedule-panel panel">
        <div class="panel-header session-header">
          <div><p class="mini-label">SESSÃO SELECIONADA</p><h3>${day.title}</h3><p class="muted">${day.focus}</p></div>
          ${day.exercises.length ? `<label class="time-control"><span>INÍCIO</span><input type="time" value="${savedTime}" aria-label="Horário de início do treino"></label>` : ''}
        </div>${session}
      </article>`;

    this.querySelector('input')?.addEventListener('change', event => {
      localStorage.setItem('atlas-start-time', event.target.value);
      this.render();
    });
    this.querySelectorAll('.timeline-item').forEach(item => item.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('exercise-change', { detail: Number(item.dataset.index), bubbles: true }));
    }));
  }
}

customElements.define('workout-timeline', WorkoutTimeline);
