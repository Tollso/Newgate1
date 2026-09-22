export function downloadCSV<T extends Record<string, any>>(data: T[], filename: string) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = data[0] && typeof data[0] === 'object' ? Object.keys(data[0]) : [];
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.join(','));

  // Value rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
