const express = require("express");
const router = express.Router();


const ListAbl = require("../abl/schedule/listAbl");
const CreateAbl = require("../abl/schedule/createAbl");
const DeleteAbl = require("../abl/schedule/deleteAbl");
const AddEventAbl = require("../abl/schedule/addEventAbl");
const DeleteEventAbl = require("../abl/schedule/deleteEventAbl");

  router.get("/list", (req, res) => {
    ListAbl(req, res);
  });
  
  router.post("/create", (req, res) => {
    CreateAbl(req, res);
  });
  
  router.post("/addEvent", (req, res) => {
    AddEventAbl(req, res);
  });

  router.delete("/deleteEvent", (req, res) => {
    DeleteEventAbl(req, res);
  }); 
  
  router.delete("/delete", (req, res) => {
    DeleteAbl(req, res);
  });
  
  module.exports = router;