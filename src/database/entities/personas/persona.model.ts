import mongoose, { Schema, Document } from "mongoose";

interface IPersona extends Document {
  nombre: string;
  apellidos: string;
  startUp?: string;
  correoElectronico: string;
  dni: string;
  telefono?: string;
}

const personaSchema: Schema = new Schema(
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

const Persona = mongoose.model<IPersona>("Persona", personaSchema);

export default Persona;
