import mongoose from "mongoose";

const personaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    startUp: { type: String },
    correoElectronico: { type: String, required: true, unique: true },
    dni: { type: String, required: true, unique: true },
    telefono: { type: String },
  },
  {
    timestamps: true,
  }
);

const Persona = mongoose.model("Persona", personaSchema);

export default Persona;
