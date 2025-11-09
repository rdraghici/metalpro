/**
 * CSV Export Utilities
 *
 * Functions for exporting cart data to CSV and generating BOM templates
 */

import type { EstimateCart } from '@/types/cart';
import type { BOMTemplate } from '@/types/bom';

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(headers: string[], rows: (string | number)[][]): string {
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of rows) {
    const escapedRow = row.map((cell) => {
      const cellStr = String(cell ?? '');
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    });
    csvRows.push(escapedRow.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Trigger browser download of CSV file
 */
function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export cart to CSV file
 *
 * Exports current cart contents in BOM format for reference or re-upload
 */
export function exportCartToCSV(cart: EstimateCart): void {
  const headers = [
    'Familie',
    'Standard',
    'Grad',
    'Dimensiune',
    'Lungime (m)',
    'Cantitate',
    'Unitate',
    'Finisaj',
    'Note',
  ];

  const rows = cart.lines.map((line) => {
    const product = line.product;
    if (!product) {
      return ['', '', '', '', '', line.quantity, line.unit, '', ''];
    }

    return [
      product.family || '',
      product.sectionProps?.standard || '',
      product.materialGrade || '',
      product.sectionProps?.dimension || '',
      line.specs.lengthM || '',
      line.quantity,
      line.unit,
      line.specs.finish || '',
      line.notes || '',
    ];
  });

  const csv = arrayToCSV(headers, rows);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `metalpro-cart-export-${timestamp}.csv`;

  downloadCSV(filename, csv);
}

/**
 * Get BOM template structure
 */
export function getBOMTemplate(): BOMTemplate {
  return {
    headers: [
      'Familie',
      'Standard',
      'Grad',
      'Dimensiune',
      'Lungime (m)',
      'Cantitate',
      'Unitate',
      'Finisaj',
      'Note',
    ],
    sampleRows: [
      // Profile HEA - will match "HEA 100 S235JR"
      [
        'profiles',
        'EN 10025',
        'S235JR',
        'HEA 100',
        '6',
        '10',
        'buc',
        '',
        'Pentru structură metalică',
      ],
      // Tablă - will match "Tablă S235JR 6mm"
      [
        'plates',
        'EN 10025',
        'S235JR',
        '6mm',
        '',
        '500',
        'kg',
        '',
        'Grosime 6mm',
      ],
      // Țeavă rectangulară - will match "Țeavă rectangulară 40x20x2mm"
      [
        'pipes',
        'EN 10219',
        'S235JRH',
        '40x20x2',
        '6',
        '20',
        'buc',
        '',
        '',
      ],
    ],
    instructions: `
Instrucțiuni pentru completarea fișierului BOM:

COLOANE OBLIGATORII:
- Cantitate: Cantitatea necesară (număr pozitiv)
- Unitate: kg, buc, m, sau ton

COLOANE OPȚIONALE (pentru auto-matching mai precis):
- Familie: profiles, plates, pipes, fasteners, stainless, nonferrous
- Standard: EN 10025, EN 10219, EN 10034, EN 10365, etc.
- Grad: S235JR, S355JR, S355J2, DC01, S235JRH, etc.
- Dimensiune: HEA 100, IPE 160, UNP 80, 6mm, 10mm, 40x20x2, etc.
- Lungime (m): Lungimea în metri (opțional, pentru calcul cantitate)
- Finisaj: Nu completați (se va selecta la checkout)
- Note: Orice observații sau cerințe speciale

VALORI ACCEPTATE PENTRU "FAMILIE":
- profiles   = Profile metalice (HEA, IPE, UNP, corniere, etc.)
- plates     = Table de oțel (table laminate la cald/rece)
- pipes      = Țevi și tuburi (rectangulare, rotunde, pătrate)
- fasteners  = Elemente de asamblare (șuruburi, piulițe, rondele)
- stainless  = Oțel inoxidabil
- nonferrous = Metale neferoase (aluminiu, cupru, bronz)

EXEMPLE DE DIMENSIUNI VALIDE:
- Profile HEA: "HEA 100", "HEA 200", "HEA 300"
- Profile IPE: "IPE 160", "IPE 200", "IPE 240"
- Profile UNP: "UNP 80", "UNP 100", "UNP 200"
- Table: "6mm", "10mm", "15mm", "20mm"
- Țevi rectangulare: "40x20x2", "50x30x3", "60x40x3"

FORMAT FIȘIER:
- CSV (comma-separated values)
- Prima linie = antet (nu modificați!)
- Codificare: UTF-8
- Separatoare: virgule (,)

SFATURI:
1. Cu cât completați mai multe coloane, cu atât matching-ul automat va fi mai precis
2. Folosiți exact valorile din catalog pentru familie (profiles, plates, pipes, etc.)
3. Dimensiunea trebuie să corespundă exact cu ce apare în titlul produsului
4. Dacă auto-matching-ul nu găsește produsul (confidence low/none), veți putea să-l mapați manual
5. Lăsați o coloană goală dacă nu aveți informația (nu scrieți "N/A" sau "-")
    `.trim(),
  };
}

/**
 * Download BOM template as CSV
 */
export function downloadBOMTemplate(): void {
  const template = getBOMTemplate();

  const csv = arrayToCSV(template.headers, template.sampleRows);

  // Add UTF-8 BOM for Excel compatibility
  const csvWithBOM = '\ufeff' + csv;

  downloadCSV('metalpro-bom-template.csv', csvWithBOM);
}
