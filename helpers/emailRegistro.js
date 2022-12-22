import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
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
        subject: "Comprueba tu cuenta en VeteriApp",
        text: "Por favor comprueba tu cuenta en VeteriApp",
        html: `<p>Hola: ${nombre}, por favor comprueba tu cuenta en VeteriApp.</p>
            <p>Tu cuenta ya está lista, sólo debes comprobarla en el siguiente link:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar tu Cuenta</a></p>

            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        `,
    }); 

    console.log("Mensaje enviado: %s", info.messageId);
};

    

export default emailRegistro;