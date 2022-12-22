import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    const { email, nombre, token } = datos

    //Enviar el email.
    const info = await transporter.sendMail({
        from: "VeteriApp",
        to: email,
        subject: "Reestablece tu password en VeteriApp",
        text: "Por favor reestablece tu password en VeteriApp",
        html: `<p>Hola: ${nombre}, has soliicitado reestablecer tu password en VeteriApp.</p>

            <p>Ve al siguiente enlace para generar un nuevo password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a></p>

            <p>Si tu no solicitaste reestablercer tú password por favor ingnora este correo y ponte en contacto con hackeo.cuenta@correo.com</p>
        `,
    }); 

    console.log("Mensaje enviado: %s", info.messageId);
};

    

export default emailOlvidePassword;