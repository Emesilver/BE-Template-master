const { sequelize } = require('../model');
const { getUnpaidJobsService, payJobService } = require('../services/jobsService');


const getUnpaidJobs = async (req, res) => {
  try {
    res.json(
      await getUnpaidJobsService(req.profile.id, req.profile.type)
    )
  } catch (error) {
    console.log(error)
    res.status(409).end(error.message)   
  }
}

const payJob = async (req, res) => {
  try {    
    await payJobService(req.profile.id, req.params.jobId)
    res.setStatus(200).end()
  } catch (error) {
    console.log(error)
    res.status(409).end(error.message)   
  }
}

module.exports = {getUnpaidJobs, payJob}
