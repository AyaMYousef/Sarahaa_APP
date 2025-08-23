



const reqkeys = ['body', 'params', 'query', 'headers']



export const validationMiddleware = (schema) => {
    return (req, res, next) => {

        const validationErrors = []

        for (const key of reqkeys) {
            console.log(key);

            if (schema[key]) {
                //abortEarly to return all errors together not one by one
                const { error } = schema[key].validate(req[key],{abortEarly:false})
                if (error) {
                    // return flatten array
                    validationErrors.push(...error.details);
                }
            }
        }// end of loop

        if(validationErrors.length){
            return res.status(400).json({message:"Validation failed",errors:validationErrors})
        }
        next()
    }
}