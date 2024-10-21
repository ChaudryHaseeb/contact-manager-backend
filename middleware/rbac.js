const rbac = (action, resource) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        const roles = {
            user: {
                contacts: ['read','write','delete'],
            },
            admin: {
                contacts: ['read', 'write', 'delete'],
                allcontacts: ['read'],
            },
        };

        if (!roles[userRole] || !roles[userRole][resource] || !roles[userRole][resource].includes(action)) {
            return res.status(403).json({ message: 'Access denied' });
        };

        next();
    };
};

module.exports = rbac;
