import { loadWorkoutData } from '../lib/workout-data.js';

class AtlasHeader extends HTMLElement {
  async connectedCallback() {
    const { brand } = await loadWorkoutData();
    this.innerHTML = `
      <header class="topbar">
        <a class="brand" href="#inicio" aria-label="${brand.name}, voltar ao início">
          <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 32"><path d="M10.2 22.4a8.2 8.2 0 0 1 .5-16.4A11.2 11.2 0 0 1 31 9a6.8 6.8 0 0 1-.2 13.5H10.2Z"/><path d="m13 25-2 4m10-4-2 4m10-4-2 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.5"/></svg></span><span>${brand.name}</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#treino">Treino</a><a href="#volume">Volume</a>
        </nav>
        <div class="header-tools"><div class="week-chip"><span></span> CICLO ATIVO</div><button class="theme-toggle" type="button" aria-label="Ativar modo claro" title="Ativar modo claro"><span aria-hidden="true">☀</span><span class="theme-toggle-label">Modo claro</span></button></div>
      </header>`;
    const toggle = this.querySelector('.theme-toggle');
    const updateThemeButton = () => {
      const dark = document.documentElement.dataset.theme !== 'light';
      toggle.setAttribute('aria-label', `Ativar modo ${dark ? 'claro' : 'escuro'}`);
      toggle.title = `Ativar modo ${dark ? 'claro' : 'escuro'}`;
      toggle.querySelector('[aria-hidden="true"]').textContent = dark ? '☀' : '☾';
      toggle.querySelector('.theme-toggle-label').textContent = `Modo ${dark ? 'claro' : 'escuro'}`;
    };
    updateThemeButton();
    toggle.addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem('mandachuva-theme', theme); } catch {}
      updateThemeButton();
    });
  }
}

customElements.define('atlas-header', AtlasHeader);
