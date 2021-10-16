const express = require("express");
const router = express.Router();
const { verifyToken } = require("../jwt");

const Review = require("../models").Review;
const Product = require("../models").Product;

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const findAllReview = await Review.findAll({
      include: [
        {
          model: Product,
          attributes: ["name", "img"],
        },
      ],
      where: { userId: req.decoded.id },
      order: [["createdAt", "Desc"]],
    });

    const response = findAllReview.map((v) => {
      return v.dataValues;
    });
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send();
  }
});

router.get("/:productId", async (req, res, next) => {
  try {
    const findAllReview = await Review.findAll({
      where: { productId: req.params.productId },
      order: [["createdAt", "Desc"]],
    });

    const response = findAllReview.map((v) => {
      return v.dataValues;
    });
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send();
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  console.log(req.body);
  try {
    await Review.create({
      text: req.body.text,
      rating: req.body.rating,
      userId: req.decoded.id,
      productId: req.body.productId,
      reservationId: req.body.reservationId,
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
