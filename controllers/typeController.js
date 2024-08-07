const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    return res.json(type);
  }

  async getAll(req, res) {
    const types = await Type.findAll();
    return res.json(types);
  }

  async delete(req, res) {
    const { name } = req.params;
    const type = await Type.destroy({ where: { name } });
    if (!type) {
      return res.status(404).json({ message: "Тип не найден" });
    }
    return res.json({ message: "Тип удален" });
  }

  async updateTypeByName(req, res) {
    const { name } = req.params;
    const { newName } = req.body;
    const type = await Type.findOne({ where: { name } });
    if (!type) {
      return res.status(404).json({ message: "Тип не найден" });
    }
    type.name = newName;
    await type.save();
    return res.json({ message: "Тип обновлен" });
  }
}

module.exports = new TypeController();
