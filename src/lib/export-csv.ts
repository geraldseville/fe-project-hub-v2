export interface CsvColumn<T> {
  header: string;
  value: (row: T) => unknown;
}

export interface ExportCsvOptions<T> {
  filename: string;
  columns: CsvColumn<T>[];
  includeBom?: boolean;
}

const escapeCsvValue = (value: unknown): string => {
  if (value == null) {
    return '';
  }

  const stringValue = String(value);
  const escapedValue = stringValue.replace(/"/g, '""');

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${escapedValue}"`;
  }

  return escapedValue;
};

const normalizeFilename = (filename: string): string => {
  return filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`;
};

export const exportCsv = <T>(rows: T[], options: ExportCsvOptions<T>): void => {
  const { filename, columns, includeBom = true } = options;

  if (!columns.length) {
    throw new Error('CSV export requires at least one column.');
  }

  const headerRow = columns
    .map((column) => escapeCsvValue(column.header))
    .join(',');

  const dataRows = rows.map((row) =>
    columns.map((column) => escapeCsvValue(column.value(row))).join(','),
  );

  const csv = [headerRow, ...dataRows].join('\r\n');

  const content = includeBom ? `\uFEFF${csv}` : csv;

  const blob = new Blob([content], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = normalizeFilename(filename);

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};
