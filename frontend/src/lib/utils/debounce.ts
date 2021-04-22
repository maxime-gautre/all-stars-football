// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number
): (...args: Parameters<T>) => ReturnType<T> {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): ReturnType<T> => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    let result: any;
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = callback(...args);
    }, waitFor);
    return result;
  };
}
