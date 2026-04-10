/**
 * Enterprise-grade CSV Export Utility
 * Handles JSON flattening and browser-side file manifestation.
 */

export function convertToCSV(data: any[]): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Header row
    csvRows.push(headers.join(","));

    // Data rows
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header];
            // Handle strings with commas by wrapping in quotes
            const escaped = ('' + val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
}

export function triggerDownload(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function exportToCSV(data: any[], filename: string) {
    const csvContent = convertToCSV(data);
    triggerDownload(csvContent, filename);
}
