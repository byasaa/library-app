const helper = require('../helper/index')
const authModel = require('../model/Auth')
const { genSaltSync, hashSync, compareSync } = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('../config/global')

module.exports = {
    register : async (req, res) => {
        const setData = req.body
        const salt = genSaltSync(10)
        setData.password = hashSync(setData.password, salt)
        try {
            const result = await authModel.registerModel(setData)
            return helper.response(res, 'success', result, 201)
        } catch (error) {
            console.log(error)
            return helper.response(res, 'fail', 'Internal server Error', 500)
        }
    },
    login : async (req,res) => {
        try {
            const username = req.body.username
            const result = await authModel.getUserByUsername(username)
            if (result[0]) {
                const user = result[0]
                const checkPass = compareSync(req.body.password, user.password)
                if (checkPass) {
                    delete user.password
                    const token = jwt.sign({ user : user }, config.secretKey,{ expiresIn : "1h" })
                    const refreshToken = jwt.sign({ user : user}, config.refreshKey, { expiresIn : '1d' })
                    result[0].token = token
                    result[0].refreshToken = refreshToken
                    return helper.response(res, 'success', result, 200)
                }
                return helper.response(res, 'fail', 'Username Or Password Is Wrong!', 403)
            }
            return helper.response(res, 'fail', 'Data Not Found', 404)
        } catch (error) {
            console.log(error)
            return helper.response(res, 'fail', 'Internal server Error', 500)
        }
    },
    logout: async (req, res) => {

    },
    token: (req ,res) => {
        try {
            const refreshToken = req.body.token
            jwt.verify(refreshToken, config.refreshKey, (error, user) => {
                if (error) return helper.response(res, 'fail', error.name, 403)
                const accessToken = jwt.sign({user : user.user}, config.secretKey, { expiresIn: '1h'})
                return helper.response(res, 'success', {token :accessToken}, 200)
            })
        } catch (error) {
            console.log(error.name)
            return helper.response(res, 'fail', 'internal server error', 403)
        }

    },
}