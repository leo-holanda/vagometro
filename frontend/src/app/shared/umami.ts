export function trackJobCollection(jobCollection: string): void {
  try {
    (window as any).umami.track(jobCollection);
  } catch (error) {
    console.warn('Umami not available');
  }
}

export function trackError(jobCollection: string, errorMessage: string): void {
  try {
    (window as any).umami.track(`${jobCollection} - Error`, {
      message: errorMessage,
    });
  } catch (error) {
    console.warn('Umami not available');
  }
}
