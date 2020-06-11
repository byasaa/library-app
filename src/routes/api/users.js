const express = require('express')
const router = express.Router()
const userController = require('../../controller/UserController')

router
    .get('/', userController.getUsers)
    .get('/:id', userController.userDetail)
    .post('/', userController.regUser)
    .put('/:id', userController.updateUser)
    .delete('/:id',userController.deleteUser)

module.exports = router;