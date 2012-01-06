/*
 * GET plan page.
 */

exports.index = function(req, res){
  res.render('plan', { title: 'Kenya Airways' });
};