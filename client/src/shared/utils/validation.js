export const is = {
  match: (testFn, message = '') => (value, fieldValues) => !testFn(value, fieldValues) && message,

  required: () => value => isNilOrEmptyString(value) && 'Это поле обязательное для заполнения.',

  minLength: min => value => !!value && value.length < min && `Минимум ${min} символов. У Вас – ${value.length}.`,

  maxLength: max => value => !!value && value.length > max && `Максимум ${max} символов. У Вас – ${value.length}.`,

  notEmptyArray: () => value =>
    Array.isArray(value) && value.length === 0 && 'Добавьте хотя-бы один элемент.',

  email: () => value => !!value && !/.+@.+\..+/.test(value) && 'Адрес почты должен быть валидный.',

  url: () => value =>
    !!value &&
    // eslint-disable-next-line no-useless-escape
    !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(value) &&
    'Ссылка должна быть валидная.',
};

const isNilOrEmptyString = value => value === undefined || value === null || value === '';

export const generateErrors = (fieldValues, fieldValidators) => {
  const errors = {};

  Object.entries(fieldValidators).forEach(([fieldName, validators]) => {
    [validators].flat().forEach(validator => {
      const errorMessage = validator(fieldValues[fieldName], fieldValues);
      if (errorMessage && !errors[fieldName]) {
        errors[fieldName] = errorMessage;
      }
    });
  });
  return errors;
};
