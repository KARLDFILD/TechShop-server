const { Basket, BasketDevice, Device } = require("../models/models");
const ApiError = require("../error/ApiError");

class BasketController {
  async addToBasket(req, res, next) {
    try {
      const userId = req.user.id;
      const { deviceId } = req.body;

      let basket = await Basket.findOne({ where: { userId } });

      if (!basket) {
        basket = await Basket.create({ userId });
      }

      const basketDevice = await BasketDevice.create({
        basketId: basket.id,
        deviceId,
      });
      return res.json(basketDevice);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getBasket(req, res, next) {
    try {
      const userId = req.user.id;

      const basket = await Basket.findOne({
        where: { userId },
        include: [
          {
            model: BasketDevice,
            include: [Device],
          },
        ],
      });

      if (!basket) {
        return next(ApiError.badRequest("Basket not found"));
      }

      return res.json(basket);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async removeFromBasket(req, res, next) {
    try {
      const userId = req.user.id;
      const { deviceId } = req.params;

      const basket = await Basket.findOne({ where: { userId } });

      if (!basket) {
        return next(ApiError.badRequest("Basket not found"));
      }

      const basketDevice = await BasketDevice.findOne({
        where: { basketId: basket.id, deviceId },
      });

      if (!basketDevice) {
        return next(ApiError.badRequest("Device not found in basket"));
      }

      await basketDevice.destroy();

      return res.json({ message: "Device removed from basket" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BasketController();
