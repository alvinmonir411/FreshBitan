import { ValueTransformer } from 'typeorm';

export const numericColumnTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => {
    if (value === null || value === undefined) {
      return null;
    }

    return Number(value);
  },
};
