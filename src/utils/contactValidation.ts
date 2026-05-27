const onlyDigits = (value: string) => value.replace(/\D/g, '');

const hasRepeatedDigits = (value: string) => /^(\d)\1+$/.test(value);

export const formatCpfCnpj = (value: string) => {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
};

export const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return digits.replace(/^(\d{2})(\d)/, '($1) $2');
  }

  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3');
  }

  return digits.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3');
};

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const isValidCpf = (value: string) => {
  const digits = onlyDigits(value);

  if (digits.length !== 11 || hasRepeatedDigits(digits)) {
    return false;
  }

  const calculateDigit = (factor: number) => {
    let total = 0;

    for (let index = 0; index < factor - 1; index += 1) {
      total += Number(digits[index]) * (factor - index);
    }

    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(10) === Number(digits[9]) && calculateDigit(11) === Number(digits[10]);
};

export const isValidCnpj = (value: string) => {
  const digits = onlyDigits(value);

  if (digits.length !== 14 || hasRepeatedDigits(digits)) {
    return false;
  }

  const calculateDigit = (base: string, weights: number[]) => {
    const total = weights.reduce((sum, weight, index) => sum + Number(base[index]) * weight, 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateDigit(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return firstDigit === Number(digits[12]) && secondDigit === Number(digits[13]);
};

export const validateCpfCnpj = (value: string) => {
  const digits = onlyDigits(value);

  if (digits.length === 11) {
    return isValidCpf(digits);
  }

  if (digits.length === 14) {
    return isValidCnpj(digits);
  }

  return false;
};

export const getCpfCnpjLabel = (value: string) => {
  const digits = onlyDigits(value);
  return digits.length > 11 ? 'CNPJ' : 'CPF';
};

export const isValidPhone = (value: string) => {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
};
