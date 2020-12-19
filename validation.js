// VALIDATION
const Joi = require('@hapi/joi');

//Register validation
const regValidation = (data) => {
    const schema = Joi.object({ 
        name: Joi.string() 
        .min(1) 
        .required(),
        email: Joi.string() 
        .min(5) 
        .required() 
        .email(),
        password: Joi.string() 
        .min(5) 
        .required() 
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({ 
        email: Joi.string() 
        .min(5) 
        .required() 
        .email(),
        password: Joi.string() 
        .min(5) 
        .required() 
    });
    return schema.validate(data);
};

module.exports.regValidation = regValidation;
module.exports.loginValidation = loginValidation;