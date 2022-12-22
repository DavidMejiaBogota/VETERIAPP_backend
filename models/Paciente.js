import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        propietario: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        fecha: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        sintomas: {
            type: String,
            required: true
        },
        veterinario : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Veterinario",
        },
    },
    {
        timestamps: true, //para que nos cree las columnas de creado y editado.
    }
);

const Paciente = mongoose.model("Paciente", pacientesSchema);//guarda la referencia del modelo y también la forma que van a tener los datos.

export default Paciente;
