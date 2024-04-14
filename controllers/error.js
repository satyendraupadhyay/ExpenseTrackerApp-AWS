// exports.get404 = (req, res, next) => {
//     res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
//   };

exports.get404 = (req, res) => {
    res.status(404).json({ error: 'Not Found' });
};