export async function delay(durationInMs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), durationInMs);
  });
}

// start inclusive, end exclusive
export function range(start, end) {
  const result = [];
  for (let num = start; num < end; ++num) result.push(num);
  return result;
}

export function times(num, fn) {
  return range(0, num).map(fn);
}

export function sample(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function randomInRange(min, max) {
  return Math.random() * (max + min) - min;
}
