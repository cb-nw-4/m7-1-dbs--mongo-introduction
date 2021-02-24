
const createGreeting = async (req, res) => {
    // temporary content... for testing purposes.
    console.log(req.body);
    res.status(200).json("ok");
  };

  module.exports = { createGreeting };