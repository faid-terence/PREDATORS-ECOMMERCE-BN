import db from "../database/models/index.js";

export const setRole = async (req, res) => {
  const {id}=req.params;
  const {setRole } = req.body; // get email and role from request body
  const user = await db.User.findOne({ where: { id:id } });

  if (!setRole) {
    return res.status(400).send("Missing setRole parameter");
  }
  if (!user) {
    return res.status(404).send(`${id} is not found`);
  }
  user.roleId = setRole;
  await user.save();
  return res.status(200).send(user);
};

export default setRole;

