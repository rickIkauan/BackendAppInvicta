const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Rota para criar usuário
exports.registerUser = async (req, res) => {
    const { email, password, username, phone, units, tools, services, admin } = req.body
    try {
        const user = new User({
            email,
            password,
            username,
            phone,
            units,
            tools,
            services,
            admin
        })
        
        await user.save()
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ message: 'Usuário não pode ser criado', err })
    }
}

// Rota para login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Email ou senha inválidos' })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.json({
            token,
            username: user.username,
            userId: user._id,
            phone: user.phone,
            administrador: user.admin
        })
    } catch (err) {
        res.status(500).json({ message: 'Ocorreu um erro', err })
    }
}

// Rota para editar usuário
exports.editUser = async (req, res) => {
    const { id } = req.params
    const { email, password, username, phone, units, tools, services, admin } = req.body
    
    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

        if (email) user.email = email
        if (password) user.password = password
        if (username) user.username = username
        if (phone) user.phone = phone
        if (units) user.units = units
        if (tools) user.tools = tools
        if (services) user.services = services
        if (admin) {
            user.admin = admin
            await user.save()
        }
        await user.save()

        res.status(200).json({ message: 'Usuário atulizado com sucesso' })
    } catch (err) {
        res.status(500).json({ message: 'Não foi possivel atualizar', err})
    }
}

// Rota para excluir usuário
exports.deleteUser = async (req, res) => {
    const { id } = req.params
    
    try {
        const user = await User.findByIdAndDelete(id)
        if (!user) return res.status(404).json({ message: 'usuário não encontrado' })

        res.status(200).json({ message: 'Usuário excluido com sucesso' })
    } catch (err) {
        res.status(500).json({ message: 'Não foi possivel excluir o usuário', err})
    }
}

// Rota para listar usuários
exports.listUsers = async (req, res) => {
    try {
        const user = await User.find()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: 'Não foi possivel listar os usuários' })
    }
}

// Rota para listar unidades do usuário 
exports.listUserUnit = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

        res.status(200).json({ unidades: user.units })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar unidades do usuário' })
    }
}

// Rota para listar ferramentas do usuário
exports.listUserTool = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

        res.status(200).json({ ferramentas: user.tools })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar ferramentas do usuário' })
    }
}

// Rota para listar serviços do usuário
exports.listUserService = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

        res.status(200).json({ serviços: user.services })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar serviços do usuário' })
    }
}