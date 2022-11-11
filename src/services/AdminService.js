const { getTopProfessionByPrice, getTopClientsByPayment } = require("./jobsService")

const getBestProfessionService = async (start, end) => {
  return getTopProfessionByPrice(start, end)
} 

const getBestClientsService = async (start, end, limit) => {
  return getTopClientsByPayment(start, end, limit)
} 

module.exports = {getBestProfessionService, getBestClientsService}