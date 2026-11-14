import { GetDashboardData } from '../../controller/dashboardController';
import { ValidateAuthTokenAsAdmin } from '../../data/middlewareGroup';
import express from 'express';

const router = express.Router();

router.get('/type=:type', ...ValidateAuthTokenAsAdmin, GetDashboardData);

export default router;