/**
 * Check if user is allowed to access this endpoint.
 * @param {*} req request
 * @param {*} res response
 * @param {*} allowedTypes array of strings of allowed types, can be ommitted if all user types of this domain are allowed.
 * @returns {boolean} false if error
 */

const authorizeUser = (req, res, allowedTypes = ['patient', 'doctor', 'admin']) => {
    if (req.session?.userType == undefined) {
        res.status(401).json({errors: ["No user token provided."]})
        return false;
    }

    if (!allowedTypes.includes(req.session?.userType)) {
        res.status(403).json({errors: [`Users of type ${req.session?.userType} do not have access here.`]})
        return false;
    }

    return true;
}

module.exports = authorizeUser;