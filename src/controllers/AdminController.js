const { getBestProfessionService, getBestClientsService } = require("../services/AdminService")


const invalidDate = (strDate) => {
  return isNaN(new Date(strDate))
}

const getBestProfession = async (req, res) => {
  if (!req.query.start || !req.query.end) {
    return res.status(400).end('start and end parameters required')
  }
  if (invalidDate(req.query.start)) {
    return res.status(400).end('start date invalid')
  }
  
  if (invalidDate(req.query.end)) {
    return res.status(400).end('end date invalid')
  }

  try {
    res.json( 
      await getBestProfessionService(req.query.start, req.query.end)
    )
  } catch (error) {
    console.log(error)
    res.status(409).end(error.message)   
  }
}

const getBestClientes = async (req, res) => {
  if (!req.query.start || !req.query.end) {
    return res.status(400).end('start and end parameters required')
  }
  if (invalidDate(req.query.start)) {
    return res.status(400).end('start date invalid')
  }
  
  if (invalidDate(req.query.end)) {
    return res.status(400).end('end date invalid')
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res.status(400).end('limit invalid')
  }

  try {
    res.json( 
      await getBestClientsService(req.query.start, req.query.end, req.query.limit)
    )
  } catch (error) {
    console.log(error)
    res.status(409).end(error.message)   
  }
}

module.exports = {getBestProfession, getBestClientes}