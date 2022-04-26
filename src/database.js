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

/**
 * Open the given SQLite database file in a readonly state to prevent
 * any modifications and try to read the "files" table.
 *
 * Could use the results to 'mainWindow.webContents.send('rows', rows);'
 *
 * @param {string} databasePath - Path to the SQLite database file
 * @returns {array} - Database rows of duplicate files
 */
export const readDuplicates = (databasePath) => {
  const db = new Better3(databasePath, { readonly: true, fileMustExist: true });
  const stmt = db.prepare(SELECT_DUPLICATES);
  const rows = stmt.all();
  db.close();
  return rows;
};

/**
 * Generate a random hash string, to use in testing.
 *
 * @returns {string} - Random hash
 */
export const randomHash = () => {
  const hash =
    Math.random().toString(16).substring(2) +
    Math.random().toString(16).substring(2);
  return hash;
};

/**
 * Generate a list of random rows to use in testing.
 *
 * @param {number} count - Number of rows to generate
 * @returns {array} - List of random rows
 */
export const generateRandomRows = (count = 100) => {
  const list = [];
  for (let i = 0; i < count; ++i) {
    list.push({
      filepath: `file-${i}-${Math.floor(Math.random() * 10000)}.txt`,
      hash: randomHash(),
      filesize: Math.round(Math.random() * 10000, 2),
      modified: new Date().toISOString(),
      count: Math.floor(Math.random() * 10 + 1),
    });
  }
  return list;
};
