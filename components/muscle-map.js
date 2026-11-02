class MuscleMap extends HTMLElement {
  set exercise(value) { this._exercise = value; this.render(); }

  muscleClass(group) {
    const index = this._exercise?.map?.indexOf(group) ?? -1;
    return index === 0 ? 'active' : index > 0 ? 'secondary' : '';
  }

  render() {
    const exercise = this._exercise;
    const title = exercise?.name || 'Recuperação total';
    const muscles = exercise?.muscles?.length ? exercise.muscles : ['Corpo inteiro'];
    const tip = exercise?.tip || 'Chegue ao próximo treino pronto para produzir força.';
    this.innerHTML = `
      <aside class="muscle-panel panel">
        <div class="panel-header compact">
          <div><p class="mini-label">MAPA DE ATIVAÇÃO</p><h3>${title}</h3></div>
          <span class="intensity-key"><i></i> FOCO</span>
        </div>
        <div class="body-map">
          ${this.figure('FRENTE', false)}${this.figure('COSTAS', true)}
        </div>
        <div class="muscle-list">${muscles.map(muscle => `<span class="muscle-pill">${muscle}</span>`).join('')}</div>
        <div class="exercise-tip"><strong>${exercise ? 'PONTO DE EXECUÇÃO' : 'META DO DIA'}:</strong> ${tip}</div>
      </aside>`;
  }

  figure(label, back) {
    const frontMuscles = `
      <ellipse class="muscle shoulder ${this.muscleClass('shoulder')}" cx="64" cy="83" rx="16" ry="19"/><ellipse class="muscle shoulder ${this.muscleClass('shoulder')}" cx="116" cy="83" rx="16" ry="19"/>
      <path class="muscle chest ${this.muscleClass('chest')}" d="M71 75 Q89 66 89 92 Q77 104 68 94Z"/><path class="muscle chest ${this.muscleClass('chest')}" d="M109 75 Q91 66 91 92 Q103 104 112 94Z"/>
      <path class="muscle biceps ${this.muscleClass('biceps')}" d="M53 104 Q64 102 63 126 L58 151 Q49 147 49 135Z"/><path class="muscle biceps ${this.muscleClass('biceps')}" d="M127 104 Q116 102 117 126 L122 151 Q131 147 131 135Z"/>
      ${this.limbs('forearms', 'forearms', 'M47 145 Q56 145 56 169 L49 187 Q40 185 42 170Z', 'M133 145 Q124 145 124 169 L131 187 Q140 185 138 170Z')}
      <path class="muscle abs ${this.muscleClass('abs')}" d="M78 105 Q90 99 102 105 L100 177 Q90 184 80 177Z"/>
      ${this.limbs('quads', 'quads', 'M69 203 Q82 199 86 218 L78 292 Q64 300 61 282Z', 'M111 203 Q98 199 94 218 L102 292 Q116 300 119 282Z')}
      ${this.limbs('calves', 'calves', 'M63 300 Q76 292 78 315 L73 371 Q59 375 60 354Z', 'M117 300 Q104 292 102 315 L107 371 Q121 375 120 354Z')}`;
    const backMuscles = `
      <ellipse class="muscle rear-delts ${this.muscleClass('rear-delts')}" cx="64" cy="83" rx="16" ry="18"/><ellipse class="muscle rear-delts ${this.muscleClass('rear-delts')}" cx="116" cy="83" rx="16" ry="18"/>
      <path class="muscle traps ${this.muscleClass('traps')}" d="M76 64 L90 60 104 64 111 91 90 105 69 91Z"/>
      ${this.limbs('back', 'back', 'M68 91 Q89 105 89 168 L68 151 62 111Z', 'M112 91 Q91 105 91 168 L112 151 118 111Z')}
      ${this.limbs('triceps', 'triceps', 'M53 104 Q64 102 63 132 L57 153 Q48 148 49 132Z', 'M127 104 Q116 102 117 132 L123 153 Q132 148 131 132Z')}
      ${this.limbs('forearms', 'forearms', 'M47 145 Q56 145 56 169 L49 187 Q40 185 42 170Z', 'M133 145 Q124 145 124 169 L131 187 Q140 185 138 170Z')}
      ${this.limbs('glutes', 'glutes', 'M69 174 Q89 164 89 207 Q72 215 66 199Z', 'M111 174 Q91 164 91 207 Q108 215 114 199Z')}
      ${this.limbs('hamstrings', 'hamstrings', 'M69 207 Q84 207 86 224 L78 292 Q64 296 61 279Z', 'M111 207 Q96 207 94 224 L102 292 Q116 296 119 279Z')}
      ${this.limbs('calves', 'calves', 'M63 300 Q76 292 78 315 L73 371 Q59 375 60 354Z', 'M117 300 Q104 292 102 315 L107 371 Q121 375 120 354Z')}`;
    return `<div class="body-figure"><span>${label}</span><svg viewBox="0 0 180 400" role="img" aria-label="Mapa muscular ${label.toLowerCase()}"><g class="silhouette"><circle cx="90" cy="35" r="25"/><path d="M69 60 Q54 70 48 97 L35 172 Q32 188 43 191 Q52 192 56 178 L66 117 68 208 57 307 Q55 320 68 322 L80 322 89 215 100 322 112 322 Q126 320 123 307 L112 208 114 117 124 178 Q128 192 137 191 Q148 188 145 172 L132 97 Q126 70 111 60Z"/></g><g>${back ? backMuscles : frontMuscles}</g></svg></div>`;
  }

  limbs(className, group, left, right) {
    const state = this.muscleClass(group);
    return `<path class="muscle ${className} ${state}" d="${left}"/><path class="muscle ${className} ${state}" d="${right}"/>`;
  }
}

customElements.define('muscle-map', MuscleMap);
