// VALIDATION
const Joi = require('@hapi/joi');

// REGISTER VALIDATION
const regValidation = (data) => {
    const schema = Joi.object({ 
        name: Joi.string() 
        .min(1) 
        .required(),
        email: Joi.string()
        .email({ tlds: { allow: false } })
        .min(1) 
        .required(),
        password: Joi.string() 
        .min(1) 
        .required() 
    });
    return schema.validate(data);
};
// LOGIN VALIDATION
const loginValidation = (data) => {
    const schema = Joi.object({ 
        email: Joi.string() 
        .min(1) 
        .required() 
        .email(),
        password: Joi.string() 
        .min(1) 
        .required() 
    });
    return schema.validate(data);
};

module.exports.regValidation = regValidation;
module.exports.loginValidation = loginValidation;