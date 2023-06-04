const router = require('express').Router();
const {
  getUsers, getUserById, postUser, patchAvatar, patchUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', postUser);
router.patch('/users/me', patchUserInfo);
router.patch('/users/me/avatar', patchAvatar);

module.exports = router;
