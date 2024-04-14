const path = require('path');

exports.getHomepage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
};

exports.getErrorPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'notFoundPage.html'));
};