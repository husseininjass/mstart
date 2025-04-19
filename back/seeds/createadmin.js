import adminModel from "../models/admin.js";

async function createDefaultAdmin() {
  const email = 'admin@mstart.com';
  const password = '123456789';
  const name = 'hussein';

  const existingAdmin = await adminModel.findOne({ where: { Email: email } });

  if (!existingAdmin) {
    await adminModel.create({
      Name: name,
      Password: password,
      Email: email,
    });
    console.log("default admin created");
  } else {
    console.log("admin already exists");
  }
}

createDefaultAdmin();
