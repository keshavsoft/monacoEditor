import express from 'express';

import funcFromshowAll from './showAll/controller.js';
import funcFrominsertWithMeta from './insertWithMeta/controller.js';
import funcFromdel from './del/controller.js';
import funcFrommodify from './modify/controller.js';

const tableName = "doctors.json";
const tablePath = "Data/doctors.json";
const configPath = "Config/Schemas/doctors.json";

const router = express.Router();

router.get('/showAll', (req, res) => funcFromshowAll({ req, res, inTablePath: tablePath }));
router.post('/insertWithMeta', express.json(), (req, res) => funcFrominsertWithMeta({ req, res, inTablePath: tablePath, inConfigPath: configPath }));
router.delete('/del/:pk', (req, res) => funcFromdel({ req, res, inTablePath: tablePath }));
router.put('/modify', express.json(), (req, res) => funcFrommodify({ req, res, inTablePath: tablePath, inConfigPath: configPath }));

export { router };