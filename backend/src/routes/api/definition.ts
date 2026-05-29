import express from 'express';
import { ValidateAuthTokenAsAdmin } from '../../data/middlewareGroup';
import { DefinitionDataValidation, DefinitionTypeValidation } from '../../middleware/Definition/DefinitionValidationMiddleware';
import { GetDefinitionRecord, CreateDefinitionRecord, UpdateDefinitionRecord, DeleteDefinitionRecord } from '../../controller/definitionController';

const router = express.Router();

// For definition
router.get('/type=:type', DefinitionTypeValidation, GetDefinitionRecord);
router.post('/type=:type', ...ValidateAuthTokenAsAdmin, DefinitionTypeValidation, DefinitionDataValidation, CreateDefinitionRecord);
router.put('/type=:type', ...ValidateAuthTokenAsAdmin, DefinitionTypeValidation, DefinitionDataValidation, UpdateDefinitionRecord);
router.delete('/type=:type', ...ValidateAuthTokenAsAdmin, DefinitionTypeValidation, DeleteDefinitionRecord);

export default router;