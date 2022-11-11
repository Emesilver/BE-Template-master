const {Op} = require('sequelize');
const {Job, Profile, Contract, sequelize} = require('../model')
const {ProfileDBType, ProfileAssociationType, ContractStatus} = require('../consts');


const translateProfileType = (profileType) => {
  return profileType  === ProfileDBType.CLIENT ? ProfileAssociationType.CLIENT : ProfileAssociationType.CONTRACTOR;
}

const baseProfileJoin = (profileId, association) => {
  return {
    model: Profile,
    as: association,
    where: {id: profileId},
    required: true,
  }
}

const baseContractJoin = (status) => {
  return {
    model: Contract,
    where: {status},
    required: true,
  }
}

const getUnpaidJobsService = async (profileId, profileType) => {
  const contractJoin = baseContractJoin(ContractStatus.IN_PROGRESS)
  contractJoin.attributes = []
  const profileJoin = baseProfileJoin(profileId, translateProfileType(profileType))
  profileJoin.attributes = []
  contractJoin.include = [profileJoin]

  return await Job.findAll({
    include: [contractJoin],
    where: {
      paid: {[Op.not]: true}
    },
  })
}

const payJobService = async (profileId, jobId) => {
  const contractJoin = baseContractJoin(ContractStatus.IN_PROGRESS)
  const profileJoin = baseProfileJoin(profileId, ProfileAssociationType.CLIENT)
  contractJoin.include = [profileJoin]
  const job = await Job.findOne({
    include: contractJoin,
    where: {id: jobId}
  })
  if (!job) {
    throw new Error(`Job id not found or contract not in progress for client ${req.profile.id}`)
  }
  if (job.paid) {
    throw new Error(`Job is already paid`)
  }
  if (job.price > job.Contract.Client.balance) {
    throw new Error(`Client balance is not enougth to pay job's price ${job.price}`)
  }

  job.Contract.Client.balance = job.Contract.Client.balance - job.price
  job.paid = true
  job.paymentDate = new Date()
  
  const t = await sequelize.transaction()
  try {
    await job.save()
    await job.Contract.Client.save()
    await t.commit()
  } catch (error) {
    console.error('Error on payment process [payJob()]: ', error)
    await t.rollback()
    throw new Error('Error on payment process.')
  }

}

const getTotalDueJobs = async (profileId) => {
  const contractJoin = baseContractJoin(ContractStatus.IN_PROGRESS)
  contractJoin.attributes = []
  const profileJoin = baseProfileJoin(profileId, ProfileAssociationType.CLIENT)
  profileJoin.attributes = []
  contractJoin.include = [profileJoin]
  
  const job = await Job.findOne({
    attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'total']],
    raw: true,
    include: contractJoin,
    where: {paid: {[Op.not]: true}}
  })
  return job.total ? job.total : 0
}

const getTopProfessionByPrice = async (start, end) => {
  const profileJoin = {
    model: Profile,
    attributes: [],
    as: ProfileAssociationType.CONTRACTOR,
    required: true,
  }
  const contractJoin = {
    model: Contract,
    attributes: [],
    required: true,
    include: [profileJoin]
  }

  const job = await Job.findOne({
    attributes: [
      'Contract->Contractor.profession',
      [sequelize.fn('SUM', sequelize.col('price')), 'total'],
    ],
    raw: true,
    include: contractJoin,
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end]
      }
    },
    group: ['Contract->Contractor.profession'],
    order: [['total', 'DESC']],
    limit: 1,
  })
  console.log(job)
  return job ? job.profession : ''
}

const DEFAULT_LIMIT = 2
const getTopClientsByPayment = async (start, end, limit) => {
  limit = limit ? limit : DEFAULT_LIMIT
  const profileJoin = {
    model: Profile,
    attributes: [
      [sequelize.literal("firstName || ' ' || lastName"), 'fullName']
    ],
    as: ProfileAssociationType.CLIENT,
    required: true,
    raw: true,
  }
  const contractJoin = {
    model: Contract,
    attributes: [],
    required: true,
    include: [profileJoin]
  }

  const job = await Job.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('price')), 'total'],
    ],
    raw: true,
    include: contractJoin,
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end]
      }
    },
    group: ['Contract.Client.id', 'Contract.Client.firstName', 'Contract.Client.lastName'],
    order: [['total', 'DESC']],
    limit,
  })
  return job
}



module.exports = {
  getTotalDueJobs, 
  getUnpaidJobsService, 
  payJobService, 
  getTopProfessionByPrice, 
  getTopClientsByPayment
}