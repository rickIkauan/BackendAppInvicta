const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.post('/create', authController.registerUser) // Rota para criar usuário
router.post('/login', authController.loginUser) // Rota para login
router.post('/edit/:id', authController.editUser) // Rota para editar usuário
router.delete('/delete/:id', authController.deleteUser) // Rota para excluir usuário
router.get('/listuser', authController.listUsers) // Rota para listar usuários
router.get('/listuser/unit/:id', authController.listUserUnit) // Rota para listar unidades do usuário
router.get('/listuser/tool/:id', authController.listUserTool) // Rota para listar ferramentas do usuário
router.get('/listuser/service/:id', authController.listUserService) // Rota para listar serviços do usuário
router.put('/edituser/:id', authController.userEdit) // Rota para usuário mudar sua senha

module.exports = router