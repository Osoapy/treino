let dataPromise;

export function loadWorkoutData() {
  dataPromise ??= fetch('./data/treino.json')
    .then(response => {
      if (!response.ok) throw new Error(`Não foi possível carregar o treino (${response.status}).`);
      return response.json();
    })
    .then(validateWorkoutData);
  return dataPromise;
}

function validateWorkoutData(data) {
  if (data?.schemaVersion !== 1 || !Array.isArray(data.days) || !data.days.length) {
    throw new Error('treino.json inválido: informe schemaVersion 1 e pelo menos um dia.');
  }
  for (const day of data.days) {
    if (!day.name || !Array.isArray(day.exercises)) throw new Error('treino.json inválido: cada dia precisa de name e exercises.');
    for (const exercise of day.exercises) {
      if (!exercise.name || !exercise.series || !exercise.reps || !exercise.duration || !Array.isArray(exercise.muscles)) {
        throw new Error(`treino.json inválido: exercício incompleto em ${day.name}.`);
      }
    }
  }
  return data;
}

export function currentDayIndex(days) {
  const mondayFirst = (new Date().getDay() + 6) % 7;
  return Math.min(mondayFirst, days.length - 1);
}

export function totalSeries(days) {
  return days.reduce((total, day) => total + day.exercises.reduce((sum, exercise) => sum + exercise.series, 0), 0);
}

const PRIMARY_TARGETS = {
  chest: { label: 'Peito', group: 'upper' },
  back: { label: 'Costas', group: 'upper' },
  quads: { label: 'Quadríceps', group: 'lower' },
  glutes: { label: 'Glúteos', group: 'lower' },
  biceps: { label: 'Bíceps / flexores', group: 'upper' },
  hamstrings: { label: 'Posteriores', group: 'lower' },
  triceps: { label: 'Tríceps', group: 'upper' },
  shoulder: { label: 'Ombros', group: 'upper' },
  'rear-delts': { label: 'Deltoide posterior', group: 'upper' },
  forearms: { label: 'Antebraços', group: 'upper' },
  abs: { label: 'Abdômen', group: 'core' },
  calves: { label: 'Panturrilhas', group: 'lower' },
  traps: { label: 'Trapézio superior', group: 'upper' }
};

export function weeklyVolume(days) {
  const totals = new Map();
  for (const day of days) {
    for (const exercise of day.exercises) {
      const target = PRIMARY_TARGETS[exercise.map?.[0]];
      if (!target) continue;

      let label = target.label;
      if (exercise.map[0] === 'shoulder' && exercise.muscles[0]?.startsWith('Deltoide ')) {
        label = exercise.muscles[0];
      } else if (exercise.map[0] === 'forearms' && ['Flexores do punho', 'Extensores do punho'].includes(exercise.muscles[0])) {
        label = exercise.muscles[0];
      }

      const entry = totals.get(label) || { label, group: target.group, series: 0 };
      entry.series += exercise.series;
      totals.set(label, entry);
    }
  }
  return [...totals.values()].sort((a, b) => b.series - a.series || a.label.localeCompare(b.label, 'pt-BR'));
}

export function focusRadar(volume) {
  const seriesFor = label => volume.find(item => item.label === label)?.series || 0;
  const sumSeries = labels => labels.reduce((sum, label) => sum + seriesFor(label), 0);
  return [
    { label: 'Peito', value: seriesFor('Peito'), group: 'upper' },
    { label: 'Costas', value: seriesFor('Costas'), group: 'upper' },
    { label: 'Ombros', value: sumSeries(['Ombros', 'Deltoide anterior', 'Deltoide lateral', 'Deltoide posterior']), group: 'upper' },
    { label: 'Braços', value: sumSeries(['Bíceps / flexores', 'Tríceps']), group: 'upper' },
    { label: 'Pernas', value: sumSeries(['Quadríceps', 'Glúteos', 'Posteriores', 'Panturrilhas']), group: 'lower' },
    { label: 'Core', value: seriesFor('Abdômen'), group: 'core' }
  ];
}
