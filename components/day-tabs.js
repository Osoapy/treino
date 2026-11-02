import { currentDayIndex } from '../lib/workout-data.js';

class DayTabs extends HTMLElement {
  set days(value) { this._days = value; this.render(); }
  set selected(value) { this._selected = value; this.render(); }

  render() {
    if (!this._days) return;
    const today = currentDayIndex(this._days);
    this.innerHTML = `<div class="day-tabs" role="tablist" aria-label="Escolha o dia do treino">
      ${this._days.map((day, index) => `<button class="day-tab ${index === this._selected ? 'active' : ''} ${index === today ? 'today' : ''}" role="tab" aria-selected="${index === this._selected}" data-day="${index}"><small>${index === today ? 'HOJE' : String(index + 1).padStart(2, '0')}</small><strong>${day.short}</strong></button>`).join('')}
    </div>`;
    this.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('day-change', { detail: Number(button.dataset.day), bubbles: true }));
    }));
  }
}

customElements.define('day-tabs', DayTabs);
