import Better3 from 'better-sqlite3';

const SELECT_DUPLICATES = `
SELECT
  filepath, hash, filesize, modified, COUNT(hash) as count
FROM
  files
GROUP BY
  hash
HAVING
  COUNT(hash) > 1
ORDER BY
  hash, filepath;
`;

const loadSqLIte = (dbPath) => {
  const db = new Better3(dbPath);
  const stmt = db.prepare(SELECT_DUPLICATES);
  const rows = stmt.all();
  console.log('rows:', rows.length);
  console.log(rows);
  db.close();

  // mainWindow.webContents.send('rows', rows);
};
