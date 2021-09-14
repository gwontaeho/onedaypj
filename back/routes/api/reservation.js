const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middlewares/jwt");

const Reservation = require("../../models").Reservation;
const Class = require("../../models").Class;
const Schedule = require("../../models").Schedule;
const Review = require("../../models").Review;

router.post("/add", verifyToken, async (req, res, next) => {
  console.log(req.body);
  console.log(req.decoded.id);

  try {
    await Reservation.create({
      name: req.body.name,
      phone: req.body.phone,
      personnel: req.body.personnel,
      sellerId: req.body.sellerId,
      scheduleId: req.body.scheduleId,
      classId: req.body.classId,
      userId: req.decoded.id,
    });
    res.status(200).send("RESERVATION SUCCESS");
  } catch (error) {
    console.log(error);
    res.status(500).send("RESERVATION FAIL");
  }
});

router.post("/history", verifyToken, async (req, res, next) => {
  console.log(req.body);
  console.log(req.decoded.id);

  console.log(req.decoded);
  let result = [];
  try {
    const findAllReservation = await Reservation.findAll({
      include: [
        {
          model: Class,
          attributes: ["name", "img"],
        },
        {
          model: Review,
        },
      ],
      where: { userId: req.decoded.id },
      order: [["createdAt", "DESC"]],
    });
    findAllReservation.forEach((v) => {
      result.push(v.dataValues);
    });
    console.log(result);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.post("/history/detail", verifyToken, async (req, res, next) => {
  console.log(req.body);
  console.log(req.decoded);
  try {
    const findReservation = await Reservation.findOne({
      include: [
        {
          model: Class,
          attributes: ["name", "img", "price"],
        },
        {
          model: Schedule,
          attributes: ["time", "personnel"],
        },
        {
          model: Review,
        },
      ],
      where: { id: req.body.id },
    });
    console.log(findReservation);
    return res.status(200).send(findReservation);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.post("/history/seller", verifyToken, async (req, res, next) => {
  console.log(req.body);
  console.log(req.decoded.id);

  console.log(req.decoded);
  let result = [];
  try {
    const findAllReservation = await Reservation.findAll({
      include: [
        {
          model: Class,
          attributes: ["name", "img", "price"],
        },
      ],
      where: { sellerId: req.decoded.id },
      order: [["createdAt", "DESC"]],
    });
    findAllReservation.forEach((v) => {
      result.push(v.dataValues);
    });
    console.log(result);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.post("/reservations", verifyToken, async (req, res, next) => {
  let result = [];
  try {
    const findAllReservation = await Reservation.findAll({
      where: { scheduleId: req.body.scheduleId },
      order: [["createdAt", "DESC"]],
    });
    findAllReservation.forEach((v) => {
      result.push(v.dataValues);
    });
    console.log(result);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.post("/cancel", verifyToken, async (req, res, next) => {
  console.log(req.body);
  try {
    await Reservation.update(
      { state: 3 },
      { where: { id: req.body.reservationId } }
    );
    return res.status(200).send("success");
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.post("/request", verifyToken, async (req, res, next) => {
  console.log(req.body);
  try {
    await Reservation.update(
      { state: 2 },
      { where: { id: req.body.reservationId } }
    );
    return res.status(200).send("success");
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.post("/withdraw", verifyToken, async (req, res, next) => {
  console.log(req.body);
  try {
    await Reservation.update(
      { state: 0 },
      { where: { id: req.body.reservationId } }
    );
    return res.status(200).send("success");
  } catch (error) {
    return res.status(401).send("error");
  }
});

module.exports = router;