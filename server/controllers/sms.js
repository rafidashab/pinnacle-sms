
const smsController = {}

smsController.submit = async function(req, res) {
    console.log("ub", req.body)
    return {}
}
smsController.test = async function(req, res) {
    res.json({message: "hey from hello"})
}

module.exports = smsController