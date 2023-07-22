import MailManager from "../../domain/managers/MailManager.js";
import forgotPasswordValidation from "../../domain/validations/session/forgotPasswordValidation.js";
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPasswordValidation.parseAsync({ email });

    const mail = new MailManager();
    await mail.sendForgotPassword(email);

    res.send({ status: "success", message: "Email sent" });
  } catch (e) {
    next(e);
  }
};
