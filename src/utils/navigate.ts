// src/utils/navigate.ts
let navigate: (path: string) => void;

export const setNavigator = (n: typeof navigate) => {
  navigate = n;
};

export const goTo = (path: string) => {
  if (navigate) navigate(path);
};
