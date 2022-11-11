const { getContractsByIdService, getContractsService } = require('../services/ContractsService');

const getContractById = async (req, res) => {
  const {id} = req.params
  try {
    res.json( 
      await getContractsByIdService(id, req.profile.id)
    )
  } catch (error) {
    console.log(error)
    res.status(409).end(error.message)   
  }
}

const getContracts = async (req, res) => {
  try {
    res.json( 
      await getContractsService(req.profile.id)
    )
  } catch (error) {
    console.log(error)
    res.status(409).end(error.message)   
  }
}

module.exports = {getContractById, getContracts}