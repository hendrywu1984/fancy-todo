const { User } = require('../models');
const { compare } = require('../helpers/bcrypt.js');
const jwt = require('../helpers/jwt.js')

class UserController{
    static login(req, res, next) {     
        const { email, password } = req.body;

        User.findOne({ where: { email }})
            .then(user => {
                let isValid = compare(password, user.password);

                if(isValid) {
                    const token = jwt.sign({ id: user.id })
                    res.status(200).json({token})
                } else {
                    res.status(400).json({
                        msg: "invalid username / password"
                    })
                }
            })
            .catch(err => { next(err) })
    }

    static getUserId(req, res, next) {     
        const { email } = req.body;

        User.findOne({ where: { email }})
            .then(user => {
                    const UserId = User.id;
                    res.status(200).json({ UserId })
            })
            .catch(err => { next(err) })
    }

    static register(req, res, next) {
        const { email, password } = req.body;
        
        User.findOne({ where: { email }})
            .then(user => {
                if(user) {
                    next({
                        name: 400,
                        msg: 'Email already exists',
                        process: 'User Registration'
                    })
                } else {
                    User.create({ email, password})
                        .then(result=> { res.status(201).json({result})})
                        .catch(err => { next(err) })
                }

            })
            .catch(err => { next(err) })
        
    }
}

module.exports = UserController;