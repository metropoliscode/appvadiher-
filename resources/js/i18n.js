import es from './../../lang/es';

const messages = {
  es,
  // Puedes agregar más idiomas
};

const currentLocale = 'es';

export const __ = (key) => {
  return messages[currentLocale][key] || key;
};
