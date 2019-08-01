class Coordinate {
  async getAll (req, res) {
    return  res.status(200).send('ok')
  }
  async getOne (req, res) {
    return res.status(200).send('ok')
  }
  async create (req, res) {
    return res.status(201).send('ok')
  }
  async update (req, res) {
    return res.status(200).send('ok')
  }
  async delete (req, res) {
    return res.status(200).send('ok')
  }
}

export default new Coordinate()