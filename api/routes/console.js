
// this is a custom middleware
const testi = () => (req, res, next) => {
    req.path === '/orders/orderId' ? console.log("/:orderId") : console.log('I passed root'), next()}


module.exports = testi
