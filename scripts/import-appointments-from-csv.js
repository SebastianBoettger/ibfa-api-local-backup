// scripts/import-appointments-from-csv.js
const { PrismaClient, AppointmentStatus } = require('@prisma/client');
const fs = require('fs');
const { parse } = require('csv-parse');

const prisma = new PrismaClient();

function normalize(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (!s || s.toUpperCase() === 'NULL') return null;
  return s;
}

function mapStatus(statusRaw) {
  const v = (statusRaw || '').toString().trim().toLowerCase();
  if (v === 'completed') return AppointmentStatus.COMPLETED;
  if (v === 'cancelled') return AppointmentStatus.CANCELLED;
  if (v === 'in_progress') return AppointmentStatus.IN_PROGRESS;
  if (v === 'confirmed') return AppointmentStatus.CONFIRMED;
  return AppointmentStatus.PLANNED;
}

function buildDateTime(dateStr, timeStr) {
  const date = normalize(dateStr);
  if (!date) return null;

  let time = normalize(timeStr) || '09:00';
  if (time.split(':').length === 2) {
    time = `${time}:00`;
  }

  return new Date(`${date}T${time}Z`);
}

async function main() {
  console.log('Starte Import aus appointments.csv ...');

  const records = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream('appointments.csv')
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          relax_quotes: true,
          relax_column_count: true,
          trim: true,
        }),
      )
      .on('data', (row) => records.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`CSV gelesen: ${records.length} Termine gefunden.`);

  let success = 0;
  let skippedNoCustomer = 0;
  let skippedNoDate = 0;
  let failed = 0;

  for (const row of records) {
    try {
      const legacyCustomerId = row.customer_id
        ? parseInt(row.customer_id, 10)
        : null;

      if (!legacyCustomerId) {
        skippedNoCustomer++;
        continue;
      }

      const customer = await prisma.customer.findUnique({
        where: { legacyId: legacyCustomerId },
      });

      if (!customer) {
        skippedNoCustomer++;
        continue;
      }

      const dateStr = normalize(row.appointment_date);
      if (!dateStr) {
        skippedNoDate++;
        continue;
      }

      const startTime =
        buildDateTime(dateStr, row.planned_start_time) ||
        buildDateTime(dateStr, '09:00');

      const endTime =
        buildDateTime(dateStr, row.planned_end_time) ||
        buildDateTime(dateStr, '10:00');

      const status = mapStatus(row.status);
      const title =
        normalize(row.appointment_type) ||
        `Termin ${dateStr} (Kunde ${legacyCustomerId})`;

      const notesParts = [];
      if (normalize(row.notes)) notesParts.push(normalize(row.notes));
      if (normalize(row.location_name))
        notesParts.push('Ort: ' + normalize(row.location_name));
      if (normalize(row.location_street))
        notesParts.push('Adresse: ' + normalize(row.location_street));
      if (normalize(row.location_postal_code) || normalize(row.location_city))
        notesParts.push(
          'PLZ/Ort: ' +
            [normalize(row.location_postal_code), normalize(row.location_city)]
              .filter(Boolean)
              .join(' '),
        );
      if (normalize(row.invoice_number))
        notesParts.push('Rechnung: ' + normalize(row.invoice_number));
      if (normalize(row.external_reference))
        notesParts.push(
          'Externe Referenz: ' + normalize(row.external_reference),
        );
      if (normalize(row.source_system))
        notesParts.push('Quelle: ' + normalize(row.source_system));
      if (normalize(row.source_key))
        notesParts.push('Quelle-Key: ' + normalize(row.source_key));

      const notes = notesParts.join(' | ') || null;

      await prisma.appointment.create({
        data: {
          customerId: customer.id,
          startTime,
          endTime,
          status,
          title,
          notes,
        },
      });

      success++;
    } catch (err) {
      failed++;
      console.error(
        '❌ Fehler beim Import eines Termins:',
        err.message,
        'Zeile:',
        row,
      );
    }
  }

  console.log('\n--- FERTIG ---');
  console.log(`✔ Erfolgreich: ${success}`);
  console.log(`➖ übersprungen (kein Kunde): ${skippedNoCustomer}`);
  console.log(`➖ übersprungen (kein Datum): ${skippedNoDate}`);
  console.log(`❗ Fehler: ${failed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
