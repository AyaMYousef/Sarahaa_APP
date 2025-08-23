


export const authorizationMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const { user: { role } } = req.loggedUser //LoggedInUser => {user:{role}}

        console.log({
            allowedRoles,
            role
        })
        if (allowedRoles.includes(role)) {
            return next()
        }

        return res.status(401).json({ message: "Unauthorized" })
    }
}