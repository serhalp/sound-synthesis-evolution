export async function delay(durationInMs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), durationInMs);
  });
}
