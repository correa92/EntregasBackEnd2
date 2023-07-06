import MailManager from "../../domain/managers/MailManager.js";

export const send = async (req, res, next) => {
  try {
    const message = req.body;

    const mail = new MailManager(message);
    await mail.send(req.body);

    res.send({ status: "success", message: "Email sent!" });

  } catch (e) {
    next(e);
  }
};
