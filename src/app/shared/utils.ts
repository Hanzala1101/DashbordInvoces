export const DateUtil = {
  formatDateForInput(dateValue: string | Date | null): string {
    if (!dateValue) {
      return '';
    }

    const normalizedDate = String(dateValue).trim();

    if (/^\d{8}$/.test(normalizedDate)) {
      return `${normalizedDate.slice(0, 4)}${normalizedDate.slice(4, 6)}${normalizedDate.slice(6, 8)}`;
    }

    return normalizedDate;
  },
};
