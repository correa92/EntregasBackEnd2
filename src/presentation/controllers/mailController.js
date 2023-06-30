import MailManager from "../../domain/managers/MailManager.js";

export const send = async (req, res) => {
  try {
    const message = req.body;

    const mail = new MailManager(message);
    await mail.send(req.body);

    res.send({ status: "success", message: "Email sent!" });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "Error", Error: error, message: error.message });
  }
};
