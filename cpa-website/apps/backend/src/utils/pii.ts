const patterns = [
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN
  /\b\d{2}-\d{7}\b/, // EIN
  /\b\d{9}\b/, // 9-digit sequences
];

const keywords = ['ssn', 'social security', 'ein', 'tax id', 'routing', 'account number'];

export const containsSensitiveInfo = (input: string): boolean => {
  const normalized = input.toLowerCase();

  if (keywords.some((keyword) => normalized.includes(keyword))) {
    return true;
  }

  return patterns.some((pattern) => pattern.test(input));
};
