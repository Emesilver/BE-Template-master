const {Contract} = require('../model')
const {Op} = require('sequelize');
const { ContractStatus } = require('../consts');

const getContractsByIdService = async (id, profileId) => {
  const contract = await Contract.findOne({where: {id, ClientId: profileId}})
  if(!contract) 
    throw new Error(`Contract not found for client/contractor ${profileId}`)
  return contract
}

const getContractsService = async (profileId) => {
  const contracts = await Contract.findAll({
      where: {
          ClientId: profileId,
          status: {[Op.ne]: ContractStatus.TERMINATED}
      }
  })
  if(!contracts.length)
    throw new Error(`No contracts found for client/contractor ${profileId}`)
  return contracts
}


module.exports = {getContractsByIdService, getContractsService}