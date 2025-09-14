import mysql from "mysql2/promise"

export const db = mysql.createPool({
  host: "switchyard.proxy.rlwy.net",
  port: 15843,
  user: "root",
  password: "kpsPcmanxmxNTtaErzAGHaqXXqWEQfnt",
  database: "railway",
});

export default db;