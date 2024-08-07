const { Brand } = require("../models/models");

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    return res.json(brand);
  }

  async getAll(req, res) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }

  async delete(req, res) {
    const { name } = req.params;
    const brand = await Brand.destroy({ where: { name } });
    if (!brand) {
      return res.status(404).json({ message: "Brand не найден" });
    }
    return res.json({ message: "Brand удален" });
  }

  async updateBrandByName(req, res) {
    const { name } = req.params;
    const { newName } = req.body;
    const brand = await Brand.findOne({ where: { name } });
    if (!brand) {
      return res.status(404).json({ message: "Brand не найден" });
    }
    brand.name = newName;
    await brand.save();
    return res.json({ message: "Brand обновлен" });
  }
}

module.exports = new BrandController();
