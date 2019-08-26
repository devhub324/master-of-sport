import express from "express";
import { User } from "../models/userModel";
import Bmi from "../models/bmiModel";
import auth from "../middleware/auth";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const router = express.Router();

router.post("/", auth, async (req, res) => {
  let user;
  user = await User.findById(req.user);

  const { value, date, category } = await req.body;

  // check if date already exist
  // eslint-disable-next-line array-callback-return
  const dateExist = user.statistics.bmi.filter(el => {
    if (el.date === date) return el;
  });
  if (dateExist[0])
    return res.status(400).send("Bmi with this date arleady exicts.");

  //create new bmi object
  let bmi = new Bmi({
    value: value,
    date: date,
    category: category
  });

  user.statistics.bmi.push(bmi);
  await user.save();

  res.status(200).send(user.statistics.bmi);
});

router.get("/", auth, async (req, res) => {
  let user;
  user = await User.findById(req.user);

  res.status(200).send(user.statistics.bmi);
});

export default router;
