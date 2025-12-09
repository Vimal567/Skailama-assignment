const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.get('/', async (req, res) => {

  const profiles = await Profile.find();
  res.json(profiles);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name required' })
  };
  const newProfile = new Profile({ name });
  await newProfile.save();
  res.status(201).json(newProfile);
});

module.exports = router;
