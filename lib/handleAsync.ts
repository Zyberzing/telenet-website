import { toast } from 'sonner';
import { ErrorInstanceCombine } from './types';

const handleAsync = <Args extends unknown[], Return>(
  fn: (...args: Args) => Promise<Return>,
): ((...args: Args) => Promise<Return | void>) => {
  return async (...args: Args): Promise<Return | void> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.log(error, ':Api Error');
      const shownMessages = new Set<string>();
      const err = error as ErrorInstanceCombine;
      const errorMessage =
        err?.response?.data?.message || err?.message || 'An error occurred. Please try again.';
      if (!shownMessages.has(errorMessage)) {
        toast.error(errorMessage);
        shownMessages.add(errorMessage);
      }
    }
  };
};

export default handleAsync;
