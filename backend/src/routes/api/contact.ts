import express from 'express';
import { ValidateAuthTokenAsAdmin } from '../../data/middlewareGroup';
import { ContactDataValidation, ContactQueryValidation, ContactTypeValidation } from '../../middleware/Contact/ContactValidationMiddleware';
import { CreateContactRecord, DeleteContactRecord, GetContactRecord, UpdateContactRecord } from '../../controller/contactController';

const router = express.Router();

// For publisher and author
router.get('/type=:type', ContactTypeValidation, ContactQueryValidation, GetContactRecord);
router.post('/type=:type', ...ValidateAuthTokenAsAdmin, ContactTypeValidation, ContactDataValidation, CreateContactRecord);
router.put('/type=:type', ...ValidateAuthTokenAsAdmin, ContactTypeValidation, ContactDataValidation, UpdateContactRecord);
router.delete('/type=:type', ...ValidateAuthTokenAsAdmin, ContactTypeValidation, ContactDataValidation, DeleteContactRecord);

export default router;