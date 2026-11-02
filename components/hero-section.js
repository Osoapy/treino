import { loadWorkoutData } from '../lib/workout-data.js';

class AtlasHero extends HTMLElement {
  async connectedCallback() {
    const data = await loadWorkoutData();
    const words = data.brand.headline.split(' ');
    const accent = words.pop();
    this.innerHTML = `
      <section class="hero section-shell" id="inicio">
        <div class="hero-copy">
          <p class="eyebrow">${data.brand.eyebrow}</p>
          <h1>${words.join(' ')}<br><em>${accent}</em></h1>
          <p class="hero-lede">${data.brand.description}</p>
          <div class="hero-actions">
            <a class="button primary" href="#treino">Ver treino de hoje <span>↓</span></a>
            <a class="button ghost" href="#volume">Explorar volume</a>
          </div>
        </div>
        <div class="hero-visual" aria-label="Nuvem animada de chuva">
          <div class="rain-cloud" role="img" aria-label="Nuvem azul soltando gotas de chuva">
            <svg class="cloud-shape" viewBox="0 0 420 280" aria-hidden="true">
              <defs><linearGradient id="cloud-fill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7f9ff"/><stop offset="1" stop-color="#91a9c6"/></linearGradient></defs>
              <path d="M93 188c-39 0-70-29-70-65 0-34 27-62 62-65C99 20 126 0 160 0c43 0 78 31 83 71 9-5 19-8 30-8 31 0 57 24 59 55 32 2 57 27 57 58 0 34-29 62-65 62H93z" fill="url(#cloud-fill)"/>
              <path d="M75 177c10 13 27 21 45 21h202c18 0 34-7 45-19" fill="none" stroke="#fff" stroke-opacity=".72" stroke-width="7" stroke-linecap="round"/>
            </svg>
            <div class="rain-drops" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </div>
        </div>
      </section>`;
  }
}

customElements.define('atlas-hero', AtlasHero);
