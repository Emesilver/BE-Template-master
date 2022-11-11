const {Profile} = require('../model')

const { getTotalDueJobs } = require("./jobsService")

const DEPOSIT_LIMIT = 1.25

const depositUserService = async (profileId, depositValue) => {
  const totalJobs = await getTotalDueJobs(profileId)
  if (!totalJobs) {
    throw new Error(`No jobs to pay by client ${profileId}`)
  }
  const upperLimit = totalJobs*DEPOSIT_LIMIT
  if (depositValue > upperLimit) {
    throw new Error(`The deposit value exceeds the limit of ${upperLimit}`)
  }

  const profile = await Profile.findByPk(profileId)
  profile.balance = profile.balance + depositValue;
  try {
    await profile.save()
    return {newBalance: profile.balance}
  } catch (error) {
    console.error('Error on deposit process [depositUser()]: ', error)
    throw new Error('Error on deposit process.')
  }

}

module.exports = {depositUserService}