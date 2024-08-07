const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const { model } = require("../db");

class deviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      console.log(info);

      if (info) {
        let infoObj = JSON.parse(info);
        infoObj.forEach((element) => {
          DeviceInfo.create({
            title: element.title,
            description: element.description,
            deviceId: device.id,
          }).catch((error) => {
            console.error("Error creating DeviceInfo:", error);
            next(
              ApiError.badRequest("Error creating DeviceInfo: " + error.message)
            );
          });
        });
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }

    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId } });
    }

    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({ where: { brandId } });
    }

    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
      });
    }

    return res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });

    return res.json(device);
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const device = await Device.destroy({
        where: { id },
      });

      if (!device) {
        return next(ApiError.badRequest("Device not found"));
      }

      return res.json({ message: "Device deleted successfully" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files || {};

      let updatedFields = { name, price, brandId, typeId };

      if (img) {
        let fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, "..", "static", fileName));
        updatedFields.img = fileName;
      }

      const device = await Device.update(updatedFields, {
        where: { id },
      });

      if (!device[0]) {
        return next(ApiError.badRequest("Device not found or no changes made"));
      }

      if (info) {
        let infoObj = JSON.parse(info);
        await DeviceInfo.destroy({ where: { deviceId: id } });
        infoObj.forEach((element) => {
          DeviceInfo.create({
            title: element.title,
            description: element.description,
            deviceId: id,
          }).catch((error) => {
            console.error("Error updating DeviceInfo:", error);
            next(
              ApiError.badRequest("Error updating DeviceInfo: " + error.message)
            );
          });
        });
      }

      return res.json({ message: "Device updated successfully" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new deviceController();
