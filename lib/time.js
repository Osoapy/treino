export function timeToMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(value) {
  const normalized = value % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

export function buildTimeline(exercises, startTime, warmupMinutes) {
  let cursor = timeToMinutes(startTime) + warmupMinutes;
  return exercises.map(exercise => {
    const start = minutesToTime(cursor);
    cursor += exercise.duration;
    return { ...exercise, start };
  });
}
