const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model');
const {getProfile} = require('./middleware/getProfile');
const { getContractById, getContracts } = require('./controllers/ContractsController');
const { getUnpaidJobs, payJob } = require('./controllers/JobsController');
const { depositUser } = require('./controllers/BalanceController');
const { getBestProfession, getBestClientes } = require('./controllers/AdminController');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)


/**
 * @returns contract by id of considering profile id
 */
 app.get('/contracts/:id', getProfile, getContractById)

/**
 * @returns client or contractor contracts
 */
 app.get('/contracts', getProfile, getContracts)

/**
 * @returns get all unpaid jobs for a user
 */
 app.get('/jobs/unpaid', getProfile, getUnpaidJobs)
 
/**
 * @returns pay for a job, a client can only pay if his balance >= the amount to pay
 */
 app.post('/jobs/:jobId/pay', getProfile, payJob)

 /**
 * @returns deposits money into the the the balance of a client
 */
 app.post('/balances/deposit/:userId', getProfile, depositUser)

 /**
 * @returns returns the profession that earned the most money
 */
 app.get('/admin/best-profession', getProfile, getBestProfession)

 /**
 * @returns returns the clients the paid the most for jobs
 */
  app.get('/admin/best-clients', getProfile, getBestClientes)

module.exports = app;
