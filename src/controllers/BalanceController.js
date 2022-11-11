const { depositUserService } = require("../services/BalanceService")

const depositUser = async (req, res) => {
  const {userId} = req.params
  console.log(req.params)
  console.log(userId)
  if (userId != req.profile.id) {
    return res.status(401).end('Unauthorized')
  }

  const {depositValue} = req.body
  try {
    res.json(
      await depositUserService(userId, depositValue)
    )
    res.status(200).end()
  } catch (error) {
    console.log(error)
    res.status(409).end(error.message)
  }
}

module.exports = {depositUser}