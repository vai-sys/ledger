const { Router } =require('express')
const {authMiddleware}=require('../middleware/auth.middleware')
const { createTransaction ,createInitialFundsTransaction }=require("../controllers/transaction.controller")

const transactionRoutes=Router();

transactionRoutes.post("/",authMiddleware,createTransaction)
transactionRoutes.post("/system/initial-funds",authMiddleware,createInitialFundsTransaction)

module.exports=transactionRoutes;