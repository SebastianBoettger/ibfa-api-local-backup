// scripts/import-customers-from-csv.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { parse } = require('csv-parse');

const prisma = new PrismaClient();

async function main() {
  console.log('Starte Import aus customers.csv ...');

  const records = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream('customers.csv')
      .pipe(
        parse({
          columns: true,       // erste Zeile = Header
          skip_empty_lines: true,
          relax_quotes: true,
          relax_column_count: true,
          trim: true,
        }),
      )
      .on('data', (row) => {
        records.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`CSV gelesen: ${records.length} Kunden gefunden.`);

  let success = 0;
  let failed = 0;

  for (const row of records) {
    try {
      // Hilfsfunktion: "NULL" und leere Strings zu null machen
      const norm = (v) => {
        if (v === undefined || v === null) return null;
        const s = String(v).trim();
        if (!s || s.toUpperCase() === 'NULL') return null;
        return s;
      };

      const name = norm(row.display_name) || 'Unbenannter Kunde';

      const data = {
        name,
        legalName: norm(
          [row.title, row.first_name, row.last_name]
            .filter((x) => !!x && x.toUpperCase() !== 'NULL')
            .join(' '),
        ),
        street: norm(row.street),
        zipCode: norm(row.postal_code),
        city: norm(row.city),
        country: norm(row.country) || 'DE',
        email: norm(row.email),
        phone: norm(row.phone),
        notes: norm(row.notes),
        isActive:
          String(row.is_active).toLowerCase() === 'true' ||
          row.is_active === true ||
          row.is_active === '1',
      };

      await prisma.customer.create({ data });
      success++;
    } catch (err) {
      failed++;
      console.error('Fehler beim Import eines Kunden:', err.message);
    }
  }

  console.log(`Import abgeschlossen. Erfolgreich: ${success}, Fehler: ${failed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
