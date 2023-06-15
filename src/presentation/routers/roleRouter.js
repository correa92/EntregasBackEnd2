import { Router } from 'express';
import auth from "../middleware/auth.js";
import { list, deleteOne, getOne, save, update } from "../controllers/roleController.js";
import authorization from "../middleware/authorization.js";

const roleRouter = Router();

roleRouter.get('/', auth, authorization('getRoles'), list);
roleRouter.get('/:id', auth, authorization('getRole'), getOne);
roleRouter.post('/', auth, auth, authorization('saveRole'), save);
roleRouter.put('/:id', auth, authorization('updateRole'), update);
roleRouter.delete('/:id', auth, authorization('deleteRole'), deleteOne);

export default roleRouter;
