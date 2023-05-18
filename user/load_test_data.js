const fs = require("fs");
const { db } = require("./db");

const stmt = db.prepare("INSERT INTO users (name, password, versionkey, phone_number) VALUES (?, ?, 1, ?)");

const csv_data = fs.readFileSync("test_users.csv", "utf8");
csv_data.split("\r\n").forEach((line) => {
  const match = line.match(/^([^,]+),([^,]+),(.*)/); // Assuming CSV format: name,password,phone_number
  const pass = match[2].substring(0, 1) + "123";
  const name = match[1] + match[3].substring(0, 1);
  const phone_number = match[3];
  console.log({ name, pass, phone_number });

  var info;
  try {
    info = stmt.run([name, pass, phone_number]);
  } catch (err) {
    if (err.code !== "SQLITE_CONSTRAINT_UNIQUE") {
      console.log("insert error: ", { err, info, user: { name, pass, phone_number } });
      return;
    }
  }
});
