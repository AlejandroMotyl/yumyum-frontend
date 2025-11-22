export const showSuccess = async (message: string) => {
  const iziToast = (await import('izitoast')).default;
  iziToast.success({ message, position: 'topRight' });
};

export const showError = async (message: string) => {
  const iziToast = (await import('izitoast')).default;
  iziToast.error({ message, position: 'topRight' });
};
