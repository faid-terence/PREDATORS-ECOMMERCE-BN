import bcrypt from 'bcrypt';

async function hasher(plaintextPassword) {
  // hash password
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
  return hashedPassword;
}

export default hasher;
