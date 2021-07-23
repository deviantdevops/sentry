const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
/**
 * https://www.npmjs.com/package/http-proxy-middleware
 */
const app = express();
const compression = require('compression')
const SERVER = require('./lib/servers');
const authMiddleware = require('./middleware/authenticate');
const fileUpload = require('express-fileupload');

app.use(morgan('dev'));
app.use(compression())
app.use(fileUpload());

/********************************************
 * MIDDLEWARE
 *******************************************/
app.use('*', (req, res, next) => authMiddleware.client(req, res, next))
app.use('*', (req, res, next) => authMiddleware.user(req, res, next))

/********************************************
 * PROXY ROUTES
 *******************************************/
/**
 * To add a new proxy route, simply add this server to /lib/servers.js
 * 'auth': 'http://localhost:7002'  WHERE 'auth' is the name of the intended
 * request recipient and 'http://....' is the actual server location.
 * 
 * Send your request to http://{SENTRY}:{PORT}/{SERVERNAME}/{ACTUAL URI} 
 * Gatekeeper will receive the request, lookup the server target using the 'auth' then remove that 
 * parmeter, leaving nly the actual URI left to send. Then it will insert {req.client} && {req.user}
 * into the request before forwarding to the server.
 */
Object.keys(global.servers).forEach(server => {
  console.log(global.servers[server])
  app.use(`/${server}`, createProxyMiddleware({
    target: global.servers[server],
    changeOrigin: false, 
    pathRewrite: {[`^/${server}`]: '',},
    followRedirects: true,
//    onProxyReq: (proxyReq, req, res, target) => {console.log(target)},
//    onProxyRes: (proxyRes, req, res) => {console.log(proxyRes)}
    onError: (err, req, res, target) => {console.log(err, target)}
  
  }));
})
/********************************************
 * ERROR HANDLING
 *******************************************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;