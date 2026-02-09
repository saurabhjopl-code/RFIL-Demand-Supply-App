export function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(row => {
    const values = row.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ? values[i].trim() : "";
    });
    return obj;
  });
}

/* ===============================
   SANITY CHECK UTIL
================================ */

export function sanityCheck(name, data, requiredColumns = []) {
  console.group(`🔍 Sanity Check: ${name}`);

  if (!Array.isArray(data)) {
    console.error(`❌ ${name}: Not an array`);
    console.groupEnd();
    return;
  }

  console.log(`✔ Rows loaded: ${data.length}`);

  if (data.length === 0) {
    console.warn(`⚠ ${name}: No data rows`);
    console.groupEnd();
    return;
  }

  const sample = data[0];
  const columns = Object.keys(sample);

  console.log("✔ Columns found:", columns);

  const missing = requiredColumns.filter(c => !columns.includes(c));
  if (missing.length > 0) {
    console.warn(`⚠ Missing columns in ${name}:`, missing);
  } else {
    console.log("✔ All required columns present");
  }

  console.log("📄 Sample row:", sample);
  console.groupEnd();
}
