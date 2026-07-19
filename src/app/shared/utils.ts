export const DateUtil = {
  formatDateForInput(dateValue: string | Date | null): string {
    if (!dateValue) {
      return '';
    }

    if (dateValue instanceof Date) {
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2, '0');
      const day = String(dateValue.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const normalizedDate = String(dateValue).trim();

    if (/^\d{8}$/.test(normalizedDate)) {
      return `${normalizedDate.slice(0, 4)}-${normalizedDate.slice(4, 6)}-${normalizedDate.slice(6, 8)}`;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
      return normalizedDate;
    }

    return normalizedDate;
  },
};
