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
              <defs><linearGradient id="cloud-fill" gradientUnits="userSpaceOnUse" x1="80" y1="35" x2="350" y2="250"><stop stop-color="#f7f9ff"/><stop offset="1" stop-color="#91a9c6"/></linearGradient></defs>
              <g fill="url(#cloud-fill)">
                <circle cx="76" cy="159" r="61"/>
                <circle cx="142" cy="105" r="83"/>
                <circle cx="239" cy="103" r="88"/>
                <circle cx="323" cy="139" r="69"/>
                <circle cx="365" cy="184" r="50"/>
                <circle cx="139" cy="194" r="57"/>
                <circle cx="226" cy="202" r="68"/>
                <circle cx="316" cy="199" r="59"/>
              </g>
            </svg>
            <div class="rain-drops" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </div>
        </div>
      </section>`;
  }
}

customElements.define('atlas-hero', AtlasHero);
