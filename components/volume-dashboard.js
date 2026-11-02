import { focusRadar, loadWorkoutData, weeklyVolume } from '../lib/workout-data.js';

class VolumeDashboard extends HTMLElement {
  async connectedCallback() {
    const data = await loadWorkoutData();
    const volume = weeklyVolume(data.days);
    const radar = focusRadar(volume);
    const max = Math.max(...volume.map(item => item.series));
    const split = data.days.reduce((result, day) => ({ ...result, [day.category]: (result[day.category] || 0) + 1 }), {});
    this.innerHTML = `
      <section class="volume-section" id="volume">
        <div class="volume-shell">
          <div class="section-heading inverse"><div><p class="eyebrow">VOLUME SEMANAL</p><h2>Onde o trabalho acontece.</h2></div><p class="heading-note">Séries contadas pelo grupo muscular principal de cada exercício. O radar reúne os mesmos dados por região.</p></div>
          <div class="charts-grid">
            <article class="chart-card volume-bars-card">
              <div class="chart-head"><span>DISTRIBUIÇÃO DE SÉRIES</span><span>0—${max}</span></div>
              <div class="volume-bars">${volume.map(item => `<div class="bar-row"><span class="bar-label">${item.label}</span><div class="bar-track"><div class="bar-fill volume-${item.group}" style="--width:${item.series / max * 100}%"></div></div><strong class="bar-value">${item.series}</strong></div>`).join('')}</div>
            </article>
            <article class="chart-card focus-card">
              <div class="chart-head"><span>MAPA DE FOCO</span><span>ÍNDICE</span></div>
              <div class="radar-wrap"><svg viewBox="0 0 360 330" role="img" aria-label="Gráfico radar de séries semanais por região">${this.radar(radar)}</svg></div>
              <div class="focus-legend"><span><i class="upper"></i> Tronco</span><span><i class="lower"></i> Pernas</span><span><i class="core"></i> Core</span></div>
            </article>
            <article class="chart-card split-card">
              <div class="chart-head"><span>ARQUITETURA DO CICLO</span><span>${data.days.length - (split.rest || 0)} + ${split.rest || 0}</span></div>
              <div class="donut-layout">
                <div class="donut" style="--active:${(data.days.length - (split.rest || 0)) / data.days.length * 100}%"><div><strong>${data.days.length - (split.rest || 0)}:${split.rest || 0}</strong><span>TREINO : OFF</span></div></div>
                <div class="split-list"><div><span><i class="upper"></i>Superiores</span><strong>${split.upper || 0} dias</strong></div><div><span><i class="lower"></i>Inferiores</span><strong>${split.lower || 0} dias</strong></div><div><span><i class="rest"></i>Recuperação</span><strong>${split.rest || 0} dia</strong></div></div>
              </div>
              <p class="chart-caption">Frequência alta, volume distribuído e recuperação programada.</p>
            </article>
          </div>
        </div>
      </section>`;
    requestAnimationFrame(() => this.querySelectorAll('.bar-fill').forEach(bar => bar.classList.add('visible')));
  }

  radar(points) {
    const center = 180, middle = 158, radius = 112, max = Math.max(...points.map(point => point.value));
    const polar = (index, distance) => { const angle = -Math.PI / 2 + index * 2 * Math.PI / points.length; return [center + Math.cos(angle) * distance, middle + Math.sin(angle) * distance]; };
    const grid = [1, .75, .5, .25].map(level => `<polygon class="radar-grid" points="${points.map((_, index) => polar(index, radius * level).join(',')).join(' ')}"/>`).join('');
    const axes = points.map((point, index) => { const [x, y] = polar(index, radius), [lx, ly] = polar(index, radius + 25); return `<line class="radar-axis" x1="${center}" y1="${middle}" x2="${x}" y2="${y}"/><text class="radar-label" x="${lx}" y="${ly + 3}">${point.label.toUpperCase()}</text>`; }).join('');
    const shape = points.map((point, index) => polar(index, radius * point.value / max));
    const segments = shape.map((point, index) => {
      const next = shape[(index + 1) % shape.length];
      return `<line class="radar-segment ${points[index].group}" x1="${point[0]}" y1="${point[1]}" x2="${next[0]}" y2="${next[1]}"/>`;
    }).join('');
    const fill = `<polygon class="radar-shape" points="${shape.map(point => point.join(',')).join(' ')}"/>`;
    const markers = shape.map((point, index) => `<circle class="radar-point ${points[index].group}" cx="${point[0]}" cy="${point[1]}" r="4"/>`).join('');
    return `${grid}${axes}${fill}${segments}${markers}`;
  }
}

customElements.define('volume-dashboard', VolumeDashboard);
